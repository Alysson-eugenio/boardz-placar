import {
  Axe,
  Crosshair,
  Cross,
  FlaskConical,
  Leaf,
  Music,
  Shield,
  Skull,
  Swords,
  VenetianMask,
  WandSparkles,
} from 'lucide-react'

// Classes de personagem. Icon: null = o peão (meeple) padrão.
export const ROLES = [
  { id: 'peao', label: 'Peão', Icon: null },
  { id: 'guerreiro', label: 'Guerreiro', Icon: Swords },
  { id: 'mago', label: 'Mago', Icon: WandSparkles },
  { id: 'ladino', label: 'Ladino', Icon: VenetianMask },
  { id: 'bardo', label: 'Bardo', Icon: Music },
  { id: 'clerigo', label: 'Clérigo', Icon: Cross },
  { id: 'arqueiro', label: 'Arqueiro', Icon: Crosshair },
  { id: 'druida', label: 'Druida', Icon: Leaf },
  { id: 'paladino', label: 'Paladino', Icon: Shield },
  { id: 'alquimista', label: 'Alquimista', Icon: FlaskConical },
  { id: 'barbaro', label: 'Bárbaro', Icon: Axe },
  { id: 'necromante', label: 'Necromante', Icon: Skull },
]

export const getRole = (id) => ROLES.find((r) => r.id === id) ?? ROLES[0]

// cada jogador novo ganha uma classe diferente (o peão fica como opção)
export function nextRole(players) {
  const used = players.map((p) => p.role)
  const pool = ROLES.filter((r) => r.id !== 'peao')
  return (pool.find((r) => !used.includes(r.id)) ?? pool[players.length % pool.length]).id
}
