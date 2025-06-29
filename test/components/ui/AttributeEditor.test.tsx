import { render, screen, fireEvent } from "@testing-library/react";
import AttributeEditor from "@/components/ui/AttributeEditor";
import "@testing-library/jest-dom";

import { describe, it, expect, vi } from "vitest";

describe("AttributeEditor", () => {
  it("should display the attribute value when not in edit mode", () => {
    render(
      <AttributeEditor
        label="Test Attribute"
        value="Test Value"
        isEditing={false}
        onEdit={() => {}}
      />
    );
    const valueElement = screen.getByText("Test Value");
    expect(valueElement).toBeInTheDocument();
  });

  it("should display an edit icon when not in edit mode", () => {
    render(
      <AttributeEditor
        label="Test Attribute"
        value="Test Value"
        isEditing={false}
        onEdit={() => {}}
      />
    );
    const editIconElement = screen.getByRole("button", { name: "Edit Edit" });
    expect(editIconElement).toBeInTheDocument();
  });

  it("should switch to edit mode when the edit icon is clicked", () => {
    const onEdit = vi.fn();
    render(
      <AttributeEditor
        label="Test Attribute"
        value="Test Value"
        isEditing={false}
        onEdit={onEdit}
      />
    );
    const editIconElement = screen.getByRole("button", { name: "Edit Edit" });
    fireEvent.click(editIconElement);
    expect(onEdit).toHaveBeenCalled();
  });

  it("should display the editor component when in edit mode", () => {
    render(
      <AttributeEditor
        label="Test Attribute"
        value="Test Value"
        isEditing={true}
        onEdit={() => {}}
      >
        <input type="text" value="Test Value" onChange={() => {}} />
      </AttributeEditor>
    );
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
  });
});
