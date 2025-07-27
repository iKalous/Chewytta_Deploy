import React from 'react';

interface ButtonProps {
    variant?: 'filled' | 'outlined' | 'text';
    size?: 'small' | 'medium' | 'large';
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    type?: 'button' | 'submit' | 'reset';
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'filled',
    size = 'medium',
    children,
    onClick,
    disabled = false,
    className = '',
    style = {},
    type = 'button',
    startIcon,
    endIcon,
    fullWidth = false,
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-20';

    const variantClasses = {
        filled: 'bg-[var(--primary)] text-[var(--on-primary)] shadow-sm hover:bg-[var(--primary-dark)] hover:shadow-md active:shadow-sm',
        outlined: 'bg-transparent text-[var(--primary)] border border-[var(--outline)] hover:bg-[var(--primary)] hover:bg-opacity-10 hover:border-[var(--primary)]',
        text: 'bg-transparent text-[var(--primary)] hover:bg-[var(--primary)] hover:bg-opacity-10'
    };

    const sizeClasses = {
        small: 'px-3 py-1.5 text-sm min-h-[32px]',
        medium: 'px-4 py-2 text-sm min-h-[40px]',
        large: 'px-6 py-3 text-base min-h-[48px]'
    };

    const disabledClasses = disabled
        ? 'opacity-50 cursor-not-allowed pointer-events-none'
        : 'cursor-pointer';

    const widthClasses = fullWidth ? 'w-full' : '';

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${className}`;

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
            style={{
                backgroundColor: variant === 'filled' ? (style?.backgroundColor || 'var(--primary)') : undefined,
                color: variant === 'filled' ? (style?.color || 'var(--on-primary)') : (style?.color || 'var(--primary)'),
                borderColor: variant === 'outlined' ? (style?.borderColor || 'var(--outline)') : undefined,
                ...style,
            }}
        >
            {startIcon && <span className="mr-2 w-4 h-4 flex items-center justify-center flex-shrink-0">{startIcon}</span>}
            <span className="flex-1">{children}</span>
            {endIcon && <span className="ml-2 w-4 h-4 flex items-center justify-center flex-shrink-0">{endIcon}</span>}
        </button>
    );
};

interface CardProps {
    children: React.ReactNode;
    variant?: 'outlined' | 'elevated';
    className?: string;
    style?: React.CSSProperties;
    hover?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'outlined',
    className = '',
    style = {},
    hover = true,
    onClick,
}) => {
    const baseClasses = 'bg-[var(--surface)] rounded-xl overflow-hidden transition-all duration-300';

    const variantClasses = {
        outlined: 'border border-[var(--outline)]',
        elevated: 'shadow-lg'
    };

    const hoverClasses = hover
        ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
        : '';

    const classes = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

    return (
        <div
            className={classes}
            onClick={onClick}
            style={{
                backgroundColor: style?.backgroundColor || 'var(--surface)',
                borderColor: variant === 'outlined' ? (style?.borderColor || 'var(--outline)') : undefined,
                boxShadow: variant === 'elevated' ? (style?.boxShadow || 'var(--shadow-2)') : undefined,
                ...style,
            }}
        >
            {children}
        </div>
    );
};

interface TextFieldProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    variant?: 'outlined' | 'filled';
    fullWidth?: boolean;
    className?: string;
    style?: React.CSSProperties;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    helperText?: string;
    error?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
}

export const TextField: React.FC<TextFieldProps> = ({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    variant = 'outlined',
    fullWidth = false,
    className = '',
    style = {},
    startIcon,
    endIcon,
    helperText,
    error = false,
    onFocus,
    onBlur,
}) => {
    const baseClasses = 'rounded-lg transition-all duration-150 focus:outline-none';

    const variantClasses = {
        outlined: `border ${error ? 'border-[var(--error)]' : 'border-[var(--outline)]'} bg-[var(--surface)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-20`,
        filled: `border-0 ${error ? 'bg-red-50' : 'bg-[var(--surface-container)]'} focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-20`
    };

    const widthClasses = fullWidth ? 'w-full' : '';
    const paddingClasses = startIcon || endIcon ? 'px-4 py-3' : 'px-4 py-3';

    const inputClasses = `${baseClasses} ${variantClasses[variant]} ${widthClasses} ${paddingClasses} ${className}`;

    return (
        <div className={`${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label
                    className={`block text-sm font-medium mb-2 ${error ? 'text-[var(--error)]' : 'text-[var(--on-surface)]'}`}
                    style={{ color: error ? 'var(--error)' : 'var(--on-surface)' }}
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {startIcon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--on-surface-variant)]">
                        {startIcon}
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`${inputClasses} ${startIcon ? 'pl-10' : ''} ${endIcon ? 'pr-10' : ''}`}
                    style={{
                        backgroundColor: 'var(--surface)',
                        borderColor: error ? 'var(--error)' : 'var(--outline)',
                        color: 'var(--on-surface)',
                        fontSize: style?.fontSize || '16px',
                        padding: '12px 16px',
                        textAlign: style?.textAlign || 'left',
                        ...style,
                    }}
                />
                {endIcon && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--on-surface-variant)]">
                        {endIcon}
                    </div>
                )}
            </div>
            {helperText && (
                <p
                    className={`text-xs mt-1 ${error ? 'text-[var(--error)]' : 'text-[var(--on-surface-variant)]'}`}
                    style={{ color: error ? 'var(--error)' : 'var(--on-surface-variant)' }}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
};

interface ChipProps {
    label: string;
    variant?: 'filled' | 'outlined';
    color?: 'default' | 'primary' | 'secondary';
    onDelete?: () => void;
    onClick?: () => void;
    className?: string;
}

export const Chip: React.FC<ChipProps> = ({
    label,
    variant = 'filled',
    color = 'default',
    onDelete,
    onClick,
    className = '',
}) => {
    const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-150';

    const colorClasses = {
        default: variant === 'filled'
            ? 'bg-[var(--surface-container)] text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]'
            : 'border border-[var(--outline)] text-[var(--on-surface)] hover:bg-[var(--surface-container)]',
        primary: variant === 'filled'
            ? 'bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-dark)]'
            : 'border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:bg-opacity-10',
        secondary: variant === 'filled'
            ? 'bg-[var(--secondary)] text-[var(--on-secondary)] hover:bg-[var(--secondary-dark)]'
            : 'border border-[var(--secondary)] text-[var(--secondary)] hover:bg-[var(--secondary)] hover:bg-opacity-10'
    };

    const clickableClasses = onClick ? 'cursor-pointer' : '';

    const classes = `${baseClasses} ${colorClasses[color]} ${clickableClasses} ${className}`;

    return (
        <div className={classes} onClick={onClick}>
            <span>{label}</span>
            {onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="ml-2 w-4 h-4 rounded-full hover:bg-gray-300 flex items-center justify-center"
                >
                    ×
                </button>
            )}
        </div>
    );
};

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary' | 'gray';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    color = 'primary',
    className = '',
}) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-6 h-6',
        large: 'w-8 h-8'
    };

    const colorClasses = {
        primary: 'border-blue-600',
        secondary: 'border-green-600',
        gray: 'border-gray-600'
    };

    const classes = `animate-spin rounded-full border-2 border-gray-200 ${colorClasses[color]} ${sizeClasses[size]} ${className}`;

    return <div className={classes} style={{ borderTopColor: 'currentColor' }} />;
};
