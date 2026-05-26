import styled from 'styled-components'
export const Smallbutton = styled.div`
  border: 1px dashed rgba(245, 239, 232, 0.4);
  width: 140px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .smallbuttonpic {
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  h4 {
    font-size: 12px;
    margin: 0;
    padding: 0;
    font-family: 'Outfit', sans-serif;
    color: #f5efe8;
    font-weight: 600;
    line-height: 1.3;
  }

  p {
    font-size: 9px;
    margin: 0;
    padding: 0;
    font-family: 'Outfit', sans-serif;
    color: rgba(245, 239, 232, 0.7);
    line-height: 1.3;
  }

  img {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
`