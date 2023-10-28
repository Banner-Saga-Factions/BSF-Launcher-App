export interface IInteractiveAssetProps {
    src: string;
    alt: string;
    className?: string;
    hoverSrc?: string;
    clickSrc?: string;
    themeOverride?: any;
    onMouseOver?: () => void;
    onMouseOut?: () => void;
    onClick?: () => void;
    inlineComponents?: [React.ReactNode];
}

export interface ITextButtonProps {
    text: string;
    className?: string;
    textStyle?: React.CSSProperties;
    onClick?: () => void;
}
