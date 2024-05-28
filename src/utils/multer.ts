import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      `${file.fieldname}-${Date.now()}${getExtension(file.originalname)}`
    );
  },
});

function getExtension(filename: string) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

const upload = multer({ storage: storage });
