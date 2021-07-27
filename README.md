<br />

<p align="center">  
  <img src="src/assets/icon.png" alt="Logo" width="80" height="80">

  <h3 align="center">Clasificar</h3>

  <p align="center">
    Sort pdf documents automatically!
    <br />
    <a href="#">View Blog Post</a>
  </p>

</p>

## About The Project

Sorting PDF files can be boring and tedious. Clasificar analyzes the existing data structure and sorts your documents into the appropriate folders. Are your PDFs not searchable? No problem, the app runs OCR on your files.

### Built With

- [Electron](https://github.com/electron/electron)
- [natural](https://github.com/NaturalNode/natural)
- [node-poppler](https://github.com/Fdawgs/node-poppler)
- [Pico.css](https://github.com/picocss/pico)

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Install dependencies
  ```sh
  brew install tesseract tesseract-lang poppler
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/fardage/Clasificar.git
   ```
2. Install NPM packages

   ```sh
   npm install
   ```

3. Build
   ```sh
   npm run make
   ```

## Contributing

Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
