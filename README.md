# CSS Unit Converter

A VS Code extension that converts CSS unit values and displays them in hover cards or comments beside the code. This extension supports units like pixels (px), ems (em), rems (rem), percentages (%), min-content, max-content, fit-content, and custom units.

## Features

- Converts CSS unit values on hover or as comments beside the code.
- Supports multiple CSS unit types and custom units.
- Easy integration with VS Code.

<!--
\!\[feature X\]\(images/feature-x.png\) -->

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Installation

1. From VS Code Marketplace:

- Open VS Code.
- Go to the Extensions view (`Ctrl + Shift + X`).
- Search for `CSS Unit Converter`.
- Click Install.

2. From Source:

- Clone the repository: `git clone https://github.com/your-username/css-unit-converter.git`
- Open the project in VS Code.
- Install dependencies: `npm install`
- Build the extension: `npm run build`
- Press `F5` to open a new VS Code window with the extension loaded.

## Usage

- Hover Conversion:

1. Hover over a CSS unit value in your code to see its converted values in a hover card.

- Comment Conversion:

1. Enable the setting `cssUnitConverter.showAsComment` in VS Code settings to display unit conversions as comments beside the code.

## Configuration

You can configure the extension using VS Code settings:

```json
{
  "cssUnitConverter.showAsComment": {
    "type": "boolean",
    "default": false,
    "description": "Show unit conversions as comments beside the code."
  }
}
```

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For issues or suggestions, please open an issue on the GitHub repository.

**Enjoy!**