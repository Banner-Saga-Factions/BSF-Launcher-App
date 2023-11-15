import { styled } from "styled-components";
import { mixins } from "@/styles";

export const AssetContainer = styled.div`
    position: relative;
    ${mixins.flexCenter};

    // apply any custom styling
    ${(props) => props.theme};

    > img {
        // absolute to allow layering
        position: absolute;
    }
`;

export const InteractiveAssetContainer = styled(AssetContainer)`
    ${mixins.interactable};
    &:hover {
        > .hover-asset {
            opacity: 1;
        }
    }
    &:active {
        > .click-asset {
            opacity: 1;
        }
    }
`;

export const Asset = styled.img`
    object-fit: cover;
`;

export const HoverAsset = styled(Asset)`
    opacity: 0;
    transition: opacity 0.3s;
`;

export const ClickAsset = styled(Asset)`
    opacity: 0;
    transition: opacity 0.1s;
`;
