import type { ElementType } from 'react'

interface Props {
  title: string
  value: string | number
  icon: ElementType
  description?: string
  color?: 'primary' | 'gold' | 'lavender' | 'green'
}

const colors = {
  primary: 'bg-primary/10 text-primary',
  gold: 'bg-gold/10 text-gold',
  lavender: 'bg-lavender/10 text-lavender',
  green: 'bg-green-100 text-green-600',
}

export default function StatCard({ title, value, icon: Icon, description, color = 'primary' }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
    </div>
  )
}
