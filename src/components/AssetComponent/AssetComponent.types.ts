export interface AssetProps {
    src: string;
    alt: string;
    className?: string;
    themeOverride?: any;
}

export interface InteractiveAssetProps {
    src: string;
    alt: string;
    className?: string;
    hoverSrc?: string;
    clickSrc?: string;
    themeOverride?: any;
    onMouseOver?: () => void;
    onMouseOut?: () => void;
    onClick?: () => void;
}
