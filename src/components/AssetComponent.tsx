import { IInteractiveAssetProps } from "@/models/props";
import { AssetContainer, Asset, HoverAsset, ClickAsset } from "@/styles/AssetStack";
import { Fragment } from "react";

export const InteractiveAsset = (props: IInteractiveAssetProps) => {
    const {
        src,
        alt,
        themeOverride,
        className,
        hoverSrc,
        clickSrc,
        onMouseOver,
        onMouseOut,
        onClick,
        inlineComponents,
    } = props;

    return (
        <AssetContainer
            theme={themeOverride}
            className={className}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
        >
            <Asset className="base-asset" src={src} alt={alt} />
            {hoverSrc && (
                <HoverAsset className="hover-asset" src={hoverSrc} alt={`${alt} hover`} />
            )}
            {clickSrc && (
                <ClickAsset className="click-asset" src={clickSrc} alt={`${alt} click`} />
            )}

            {/* Any other inline components */}
            {inlineComponents?.map((component, i) => (
                <Fragment key={`${className}-inline-${i}`}>{component}</Fragment>
            ))}
        </AssetContainer>
    );
};
