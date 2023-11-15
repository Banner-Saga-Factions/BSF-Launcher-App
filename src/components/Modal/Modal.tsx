import modalBase from "@/assets/modal_narrow.png";
import { AssetComponent } from "@/components/AssetComponent";
import { PropsWithChildren } from "react";
import { styles } from "./";

export const Modal: React.FC<PropsWithChildren & { className: string }> = (
    props: PropsWithChildren & { className: string }
) => {
    return (
        <styles.ModalContainer>
            <AssetComponent
                src={modalBase}
                alt={`modal base`}
                className={`modal-container ${props.className}`}
                themeOverride={styles.modalStyle}
            >
                {props.children}
            </AssetComponent>
        </styles.ModalContainer>
    );
};
