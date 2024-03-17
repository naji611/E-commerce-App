// admin.js
const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  const productElement = btn.closest("article");
  console.log("Product ID:", productId);
  console.log("CSRF Token:", csrf);
  console.log("Product Element:", productElement);

  fetch("/admin/products/" + productId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((results) => {
      console.log("Response:", results);
      productElement.remove();
    })
    .catch((err) => {
      console.log("Error:", err);
    });
};

document.addEventListener("DOMContentLoaded", function () {
  const btns = document.querySelectorAll(".btnDe");
  btns.forEach((btn) => {
    btn.addEventListener("click", function () {
      deleteProduct(this);
    });
  });
});
