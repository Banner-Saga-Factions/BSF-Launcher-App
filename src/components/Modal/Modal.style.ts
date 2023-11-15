import { styled, css } from "styled-components";
import { mixins } from "@/styles";

export const modalStyle = css`
    > .base-asset {
        height: 90vmin;
        z-index: 1;
    }
    > .asset-children {
        display: grid;
        grid-template-rows: 1fr 4fr 1fr;
        max-height: 75vmin;
        z-index: 2;
    }
`;

export const ModalContainer = styled.div`
    ${mixins.engulf}
    ${mixins.flexCenter}
    background-color: rgba(70, 70, 70, 0.2);
    backdrop-filter: blur(4px);
    position: fixed;
    top: 0;
`;

export const ModalContent = styled.div`
    ${mixins.flexCenter}
    flex-direction: column;
    position: relative;
    font-size: 32px;
`;

export const ModalTitle = styled.h1`
    ${mixins.titleText}
    text-align: center;
    max-width: 40vmin;
    color: ${(props) => props.theme.colors.beige};
`;
