import { styled } from "styled-components";
import { mixins } from "./mixins";

const AssetContainer = styled.div`
    position: relative;
    ${mixins.flexCenter};

    // apply any custom styling
    ${(props) => props.theme};

    > img {
        // absolute to allow layering
        position: absolute;
    }
`;

const InteractiveAssetContainer = styled(AssetContainer)`
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

const Asset = styled.img`
    object-fit: cover;
`;

const HoverAsset = styled(Asset)`
    opacity: 0;
    transition: opacity 0.3s;
`;

const ClickAsset = styled(Asset)`
    opacity: 0;
    transition: opacity 0.1s;
`;

export { AssetContainer, InteractiveAssetContainer, Asset, HoverAsset, ClickAsset };
