import PropTypes from 'prop-types'

export type ButtonProps = {
  label: string | React.ReactNode
  onClick?: () => void
  className?: string
  type?: 'submit' | 'reset' | 'button'
  style?: React.CSSProperties
  disabled?: boolean
}
export default function Button(props: ButtonProps) {
  const {
    label,
    onClick,
    className,
    type = 'button',
    style,
    disabled = false,
  } = props
  return (
    <div>
      <button
        className={className}
        type={type}
        onClick={onClick}
        style={style}
        disabled={disabled}
      >
        {label}
      </button>
    </div>
  )
}

Button.propType = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['submit', 'reset', 'button']),
  style: PropTypes.object,
}
