import buttonBase from "@/assets/banner_button/base.png";
import buttonHighlight from "@/assets/banner_button/highlight.png";
import buttonClick from "@/assets/banner_button/shade.png";
import { InteractiveAsset } from "@/components/AssetComponent";
import { mixins } from "@/styles/mixins";
import { css } from "styled-components";
import { PropsWithChildren } from "react";

import { styles, TextButtonProps } from "./";

const assetExtension = css`
    fontSize: "64px",
                    color: theme.colors.beige,
                    textShadow: "0px 0px 15px black",
                    bottom: "20px",
    > div {
        ${mixins.flexCenter}
    }
    > .base-asset {
        height: 80%;
    }

    > .hover-asset {
        height: 78%;
    }
    > .click-asset {
        height: 80%;
    }
`;

export const BannerButton = (props: PropsWithChildren<TextButtonProps>) => {
    const { className, textStyle, onClick, children } = props;

    return (
        <InteractiveAsset
            src={buttonBase}
            alt={`button`}
            className={className}
            hoverSrc={buttonHighlight}
            clickSrc={buttonClick}
            themeOverride={assetExtension}
            onClick={onClick}
        >
            <styles.BannerButtonText style={textStyle }>{children}</styles.BannerButtonText>
        </InteractiveAsset>
    );
};
