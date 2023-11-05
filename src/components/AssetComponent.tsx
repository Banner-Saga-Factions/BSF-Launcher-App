import { AssetProps, InteractiveAssetProps } from "@/models/props";
import {
    InteractiveAssetContainer,
    Asset,
    HoverAsset,
    ClickAsset,
    AssetContainer,
} from "@/styles/AssetStack";
import { PropsWithChildren } from "react";

export const AssetComponent = (props: PropsWithChildren<AssetProps>) => {
    const { src, alt, themeOverride, className, children } = props;

    return (
        <AssetContainer theme={themeOverride} className={className}>
            <Asset className="base-asset" src={src} alt={alt} />
            <div className="asset-children">{children}</div>
        </AssetContainer>
    );
};

export const InteractiveAsset = (props: PropsWithChildren<InteractiveAssetProps>) => {
    const {
        children,
        src,
        alt,
        themeOverride,
        className,
        hoverSrc,
        clickSrc,
        onMouseOver,
        onMouseOut,
        onClick,
    } = props;

    return (
        <InteractiveAssetContainer
            theme={themeOverride}
            className={className}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
        >
            <Asset className="base-asset" src={src} alt={alt} />
            {clickSrc && <ClickAsset className="click-asset" src={clickSrc} alt={`${alt} click`} />}
            {hoverSrc && <HoverAsset className="hover-asset" src={hoverSrc} alt={`${alt} hover`} />}

            <div className="asset-children">{children}</div>
        </InteractiveAssetContainer>
    );
};
