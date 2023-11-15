import { PropsWithChildren } from "react";

import { AssetProps, InteractiveAssetProps } from "./AssetComponent.types";
import { styles } from "./";

export const AssetComponent = (props: PropsWithChildren<AssetProps>) => {
    const { src, alt, themeOverride, className, children } = props;

    return (
        <styles.AssetContainer theme={themeOverride} className={className}>
            <styles.Asset className="base-asset" src={src} alt={alt} />
            <div className="asset-children">{children}</div>
        </styles.AssetContainer>
    );
};

export const InteractiveAsset = (props: PropsWithChildren<InteractiveAssetProps>) => {
    return (
        <styles.InteractiveAssetContainer
            theme={props.themeOverride}
            className={props.className}
            onMouseOver={props.onMouseOver}
            onMouseOut={props.onMouseOut}
            onClick={props.onClick}
        >
            <styles.Asset className="base-asset" src={props.src} alt={props.alt} />
            {props.clickSrc && (
                <styles.ClickAsset
                    className="click-asset"
                    src={props.clickSrc}
                    alt={`${props.alt} click`}
                />
            )}
            {props.hoverSrc && (
                <styles.HoverAsset
                    className="hover-asset"
                    src={props.hoverSrc}
                    alt={`${props.alt} hover`}
                />
            )}

            <div className="asset-children">{props.children}</div>
        </styles.InteractiveAssetContainer>
    );
};
