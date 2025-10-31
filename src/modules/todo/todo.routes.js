const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Todos get all todos");
});
// router.post("/");
// router.get("/");
// router.get("/:id");
// router.put("/:id");
// router.patch("/:id/complete");
// router.delete("/:id");
// router.post("/:id/restore");

module.exports = router;
