import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
    const variantStyles = {
      default: 'bg-foreground text-background hover:bg-foreground/90',
      outline: 'border border-foreground/20 hover:bg-foreground/5',
      destructive: 'bg-red-600 text-white hover:bg-red-700'
    }
    
    return (
      <button
        className={`${baseStyles} ${variantStyles[variant]} px-4 py-2 ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
