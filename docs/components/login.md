---
title: Login
description: A standalone email/password login form.
---

# Login

`Login` is a self-contained email/password sign-in form — a standalone utility component, not a schema-driven [AForm](/reference/aform) field. It manages its own `email`/`password` input state internally and emits `loginSuccess` or `loginFailed` when the form is submitted; wiring those events to a real authentication call is left to the consuming application.

## Import

```ts
import { Login } from '@stonecrop/aform'
```

## Basic

This demo listens for `loginSuccess`/`loginFailed` and prints whichever one fired below — it intercepts the submit outcome purely for demonstration purposes and does not perform any real authentication. Per the component's current source, the internal failure path is never triggered, so submitting currently always emits `loginSuccess` regardless of what's entered. Type any email and password and click **Login** to see it fire.

<DemoPanel>

<ClientOnly>
	<LoginDemo />
</ClientOnly>

<template #code>

<<< ../.vitepress/theme/demos/LoginDemo.vue

</template>

</DemoPanel>

## API Reference

### Props

<div class="api-table">

| Name              | Type     | Default                                       | Description                          |
| ----------------- | -------- | ----------------------------------------------- | --------------------------------------- |
| `headerTitle`     | `string` | `'Login'`                                       | Heading text above the form.          |
| `headerSubtitle`  | `string` | `'Enter your email and password to login'`      | Subheading text below the title.      |

</div>

### Emits

<div class="api-table">

| Name           | Payload | Description                                                                                                                     |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `loginSuccess` | none    | Emitted on submit whenever the (currently unimplemented) failure path isn't taken — in the current source this fires on every submit. |
| `loginFailed`  | none    | Emitted on submit if the internal `loginFailed` flag is set — nothing in the current source ever sets it, so this never fires yet. |

</div>

Neither `email` nor `password` is exposed to the parent — they're local `ref`s inside `Login`, and both emits above carry no payload.

## Accessibility

The email and password `<input>` fields are associated with their `<label>`s via matching `id`/`for` pairs, so screen readers announce them correctly on focus. The submit button exposes an `isLoading` state that swaps in a spinning icon and disables the button while true, and is otherwise disabled until both fields are non-empty; the "Forgot password?" control renders as a plain `<button>` with no wired behavior yet.

Source: [`aform/src/components/utilities/Login.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/utilities/Login.vue)
