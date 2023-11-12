import buttonBase from "@/assets/banner_button/base.png";
import buttonHighlight from "@/assets/banner_button/highlight.png";
import buttonClick from "@/assets/banner_button/shade.png";
import { InteractiveAsset } from "@/components/AssetComponent";
import { TextButtonProps } from "@/models/props";
import { ButtonText } from "@/styles/StyledText";
import { mixins } from "@/styles/mixins";
import { css } from "styled-components";
import { PropsWithChildren } from "react";

const assetExtension = css`
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
            <ButtonText style={textStyle}>{children}</ButtonText>
        </InteractiveAsset>
    );
};
