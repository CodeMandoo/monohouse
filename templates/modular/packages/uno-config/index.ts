import { presetAttributify, presetUno } from 'unocss'

export const sharedPresets = [presetAttributify(), presetUno()]

export const sharedRules: [string, Record<string, string>][] = [
  ['rounded-4', { borderRadius: '16px' }],
  ['tracking-3', { letterSpacing: '0.3em' }],
]

export const sharedShortcuts: Record<string, string> = {
  'card-base': 'rounded-4 bg-white shadow-sm',
}
