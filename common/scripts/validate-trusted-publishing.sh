#!/usr/bin/env bash
#
# Validates npm trusted publishing for every publishable package.
#
# Run this before "rush version --bump". npm never validates a trusted publisher
# when it is saved, so a wrong or revoked record only surfaces once "rush publish"
# reaches that package — by which point the bump is committed and pushed, leaving
# lockstep packages depending on siblings that were never published.
#
# Publishes nothing: the exchange endpoint only mints a short-lived, package-scoped
# token, and the visibility endpoint is a read.
#
# Requires "id-token: write" on the calling job, plus curl and jq.

set -euo pipefail

readonly REGISTRY_HOST="registry.npmjs.org"
readonly REGISTRY="https://${REGISTRY_HOST}"
readonly VERSION_POLICY="stonecrop"
readonly SAMPLE_PACKAGE_DIR="aform"

die() {
	echo "::error::$*"
	exit 1
}

# Decodes base64url (JWT payload alphabet), restoring the padding base64 needs.
b64url_decode() {
	local data="${1//-/+}"
	data="${data//_//}"
	case $((${#data} % 4)) in
		2) data="${data}==" ;;
		3) data="${data}=" ;;
	esac
	printf '%s' "${data}" | base64 -d 2>/dev/null
}

# @stonecrop/aform -> @stonecrop%2faform
escape_name() {
	printf '%s' "${1//\//%2f}"
}

# Sets ID_TOKEN. Assigns a global rather than echoing: a $(...) caller would run
# this in a subshell, where die's message is captured instead of logged.
mint_id_token() {
	if [ -z "${ACTIONS_ID_TOKEN_REQUEST_URL:-}" ] || [ -z "${ACTIONS_ID_TOKEN_REQUEST_TOKEN:-}" ]; then
		die "No ACTIONS_ID_TOKEN_REQUEST_* in the environment: this job is missing 'id-token: write'. A job's permissions block replaces the workflow's, it does not merge."
	fi

	ID_TOKEN=$(curl -sS \
		-H "Authorization: Bearer ${ACTIONS_ID_TOKEN_REQUEST_TOKEN}" \
		-H "Accept: application/json" \
		"${ACTIONS_ID_TOKEN_REQUEST_URL}&audience=npm:${REGISTRY_HOST}" |
		jq -r '.value // empty') || true

	[ -n "${ID_TOKEN}" ] || die "Could not mint an id-token."
}

# The publishable set, taken from Rush rather than hardcoded so it cannot drift
# from what "rush publish --version-policy" actually releases.
list_publishable_packages() {
	node common/scripts/install-run-rush.js list --json |
		sed -n '/^{/,$p' |
		jq -r --arg policy "${VERSION_POLICY}" \
			'.projects[] | select(.versionPolicyName == $policy) | .name'
}

# Sets MINTED (empty on failure) and FAILURE. Globals rather than echoed output:
# in a $(...) subshell FAILURE would never reach the caller.
#
# Success is 201, not 200, so accept any 2xx carrying a token — the same test npm
# applies. Only .message is ever printed: a success body holds a live credential.
exchange_token() {
	local pkg="$1" body status
	MINTED=""
	FAILURE=""
	body=$(mktemp)
	status=$(curl -sS -o "${body}" -w '%{http_code}' -X POST \
		-H "Authorization: Bearer ${ID_TOKEN}" \
		-H "Accept: application/json" \
		-H "Content-Length: 0" \
		"${REGISTRY}/-/npm/v1/oidc/token/exchange/package/$(escape_name "${pkg}")")

	MINTED=$(jq -r '.token // empty' "${body}" 2>/dev/null || true)
	case "${status}" in
		2*)
			if [ -z "${MINTED}" ]; then
				FAILURE="HTTP ${status} carried no token"
			fi
			;;
		*)
			MINTED=""
			FAILURE="HTTP ${status}: $(jq -r '.message // "no message"' "${body}" 2>/dev/null || echo 'unparseable response')"
			;;
	esac

	rm -f "${body}"
}

# OIDC attaches provenance only when the repository and the package are both public.
package_is_public() {
	local pkg="$1" token="$2"
	[ "$(curl -sS \
		-H "Authorization: Bearer ${token}" \
		-H "Accept: application/json" \
		"${REGISTRY}/-/package/$(escape_name "${pkg}")/visibility" |
		jq -r '.public // false')" = "true" ]
}

# Cross-check that npm still decides provenance the way this script assumes.
# --force: runs before the bump, so package.json still holds the published version.
# --ignore-scripts: prepublishOnly would rebuild the package for nothing; dist/ is already built.
# (It no longer *needs* skipping — the docs step went from `rushx docs` to `node --run docs`, which
# resolves outside Rush — but a dry run has no reason to pay for a rebuild.)
confirm_against_npm_client() {
	local log
	log=$(mktemp)
	(cd "${SAMPLE_PACKAGE_DIR}" && npm publish --dry-run --force --ignore-scripts --loglevel=silly) \
		>"${log}" 2>&1 || true

	if ! grep -q "oidc.*Successfully retrieved and set token" "${log}"; then
		grep -i "oidc" "${log}" || echo "  (npm never attempted the exchange)"
		rm -f "${log}"
		die "npm disagrees: it did not authenticate via OIDC in ${SAMPLE_PACKAGE_DIR}."
	fi
	if ! grep -q "oidc.*Enabling provenance" "${log}"; then
		rm -f "${log}"
		die "npm disagrees: it would not attach provenance in ${SAMPLE_PACKAGE_DIR}."
	fi
	rm -f "${log}"
}

main() {
	mint_id_token
	echo "::add-mask::${ID_TOKEN}"

	# repository_visibility is a claim on the id token and applies to every package.
	local repo_visibility
	repo_visibility=$(b64url_decode "$(printf '%s' "${ID_TOKEN}" | cut -d. -f2)" |
		jq -r '.repository_visibility // "unknown"')
	if [ "${repo_visibility}" != "public" ]; then
		die "Repository visibility is '${repo_visibility}', so npm will not attach provenance to any package."
	fi

	local failed=0 pkg
	printf '  %-34s %-8s %s\n' "PACKAGE" "AUTH" "PROVENANCE"

	while read -r pkg; do
		exchange_token "${pkg}"

		if [ -z "${MINTED}" ]; then
			printf '  %-34s %-8s %s\n' "${pkg}" "FAIL" "-"
			echo "      ${FAILURE}"
			failed=1
			continue
		fi
		echo "::add-mask::${MINTED}"

		if package_is_public "${pkg}" "${MINTED}"; then
			printf '  %-34s %-8s %s\n' "${pkg}" "ok" "ok"
		else
			printf '  %-34s %-8s %s\n' "${pkg}" "ok" "FAIL"
			echo "      package is not public, so it would publish without provenance"
			failed=1
		fi
	done < <(list_publishable_packages)

	[ "${failed}" -eq 0 ] || die "Trusted publishing is not ready. Compare the failures against 'npm trust list <package>' — organization, repository and workflow filename are case-sensitive and exact."

	confirm_against_npm_client

	echo "::notice::Trusted publishing verified: every package authenticates over OIDC and will carry provenance."
}

main "$@"
