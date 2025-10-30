import clsx from 'clsx'

export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-7',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
