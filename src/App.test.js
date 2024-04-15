import { render, screen } from "@testing-library/react";
import GetBlock from "./getBlock";
import GetBalances from "./getBalances";

test("renders learn react link", () => {
  render(<GetBlock />);
  render(<GetBalances />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
