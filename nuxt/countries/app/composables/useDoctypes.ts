import type { DoctypeConfig } from '@stonecrop/stonecrop'

// Eagerly load all JSON doctype definitions from app/doctypes/
const modules = import.meta.glob<DoctypeConfig>('../doctypes/*.json', {
  eager: true,
  import: 'default',
})

export const doctypeMap = new Map<string, DoctypeConfig>()

for (const [path, doctype] of Object.entries(modules)) {
  // Use the filename (without .json) as the URL slug key
  const slug = path.split('/').pop()!.replace('.json', '')
  doctypeMap.set(slug, doctype)
}

export function useDoctypeConfig(slug: string): DoctypeConfig | undefined {
  return doctypeMap.get(slug) ?? doctypeMap.get(slug.toLowerCase())
}
