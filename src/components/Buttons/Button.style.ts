import { styled } from "styled-components";
import { mixins } from "@/styles";

export const ButtonText = styled.h2`
    ${mixins.buttonText}
    padding: 15%;
    margin: unset;
    text-shadow: 0px 0px 15px ${(props) => props.theme.colors.blue};
    color: ${(props) => props.theme.colors.lightBlue};
    ${mixins.buttonText}
`;
