import modalBase from "@/assets/modal_narrow.png";
import { AssetComponent } from "@/components/AssetComponent";
import { PropsWithChildren } from "react";
import { styled, css } from "styled-components";
import { mixins } from "@/styles/mixins";

const modalStyle = css`
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

const ModalContainer = styled.div`
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

export const Modal: React.FC<PropsWithChildren & { className: string }> = (
    props: PropsWithChildren & { className: string }
) => {
    return (
        <ModalContainer>
            <AssetComponent
                src={modalBase}
                alt={`modal base`}
                className={`modal-container ${props.className}`}
                themeOverride={modalStyle}
            >
                {props.children}
            </AssetComponent>
        </ModalContainer>
    );
};
