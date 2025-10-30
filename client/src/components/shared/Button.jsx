import clsx from 'clsx'

const base = 'inline-flex items-center justify-center rounded-2xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-3 text-base',
  lg: 'px-6 py-3.5 text-lg',
}
const variants = {
  primary: 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED] focus:ring-[#C7B8EA]',
  outline: 'bg-white text-[#1E1E1E] border border-slate-200 hover:bg-slate-50 focus:ring-[#C7B8EA]',
  ghost: 'text-[#1E1E1E] hover:bg-white/60 focus:ring-[#C7B8EA]',
}

export default function Button({ as: As = 'button', variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <As className={clsx(base, sizes[size], variants[variant], className)} {...props}>
      {children}
    </As>
  )
}
