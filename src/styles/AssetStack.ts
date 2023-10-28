import { styled } from "styled-components";
import { mixins } from "./mixins";

const AssetContainer = styled.div`
    position: relative;

    // center elements
    ${mixins.flexCenter};

    // apply any custom styling
    ${(props) => props.theme};

    > img {
        // absolute allows layering
        position: absolute;
    }

    transition: transform 0.3s;
    &:hover {
        transform: scale(1.02);
        cursor: pointer;
        > .hover-asset {
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

export { AssetContainer, Asset, HoverAsset, ClickAsset };
