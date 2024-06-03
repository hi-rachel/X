import { styled } from "styled-components";
import { FONTS, FONTS_WEIGHT } from "../constants/fonts";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

export const HoverButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 5px;

  cursor: pointer;
  &:hover,
  &:active {
    background-color: var(--gray-100);
  }
  @media (prefers-color-scheme: dark) {
    &:hover,
    &:active {
      background-color: var(--gray);
    }
  }
`;

export const EditButton = styled.button`
  font-weight: ${FONTS_WEIGHT.medium};
  font-size: ${FONTS.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  cursor: pointer;
  &:hover,
  &:active {
    background-color: var(--gray-100);
  }
  @media (prefers-color-scheme: dark) {
    &:hover,
    &:active {
      background-color: var(--gray);
    }
  }
`;

export const AttachFileInput = styled.input`
  display: none;
`;

export const Tag = styled.div`
  font-weight: ${FONTS_WEIGHT.semiBold};
  font-size: ${FONTS.sm};
  color: var(--primary);
  border-radius: 50px;
  padding: 6px 12px;
  background-color: var(--gray--100);

  @media (max-width: 480px) {
    font-size: ${FONTS.xs};
    padding: 3px 8px;
  }

  @media (prefers-color-scheme: dark) {
    background-color: var(--gray);
  }
`;
