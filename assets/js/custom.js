document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("a[href]").forEach(function (link) {
        const href = link.getAttribute("href");

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("javascript:")
        ) {
            return;
        }

        try {
            const url = new URL(href, window.location.href);

            const isWebLink =
                url.protocol === "http:" ||
                url.protocol === "https:";

            const isExternal =
                isWebLink &&
                url.origin !== window.location.origin;

            const isPdf =
                url.pathname.toLowerCase().endsWith(".pdf");

            if (isExternal || isPdf) {
                link.setAttribute("target", "_blank");
                link.relList.add("noopener", "noreferrer");
            } else {
                link.removeAttribute("target");
            }
        } catch (error) {
            console.warn("Unable to process link:", href);
        }
    });
});

function initializeProjectMobileMenu() {
    if (!document.body.classList.contains("project-page")) {
        return;
    }

    /*
     * The original template normally creates titleBar through main.js.
     * Create it here only when it is missing.
     */
    if (document.getElementById("titleBar")) {
        return;
    }

    const logo = document.getElementById("logo");
    const header = document.getElementById("header");

    if (!logo || !header) {
        return;
    }

    const titleBar = document.createElement("div");
    titleBar.id = "titleBar";

    const title = document.createElement("span");
    title.className = "title";
    title.innerHTML = logo.innerHTML;

    const toggle = document.createElement("a");
    toggle.href = "#header";
    toggle.className = "toggle";
    toggle.setAttribute("aria-label", "Open navigation menu");
    toggle.setAttribute("aria-controls", "header");
    toggle.setAttribute("aria-expanded", "false");

    titleBar.appendChild(title);
    titleBar.appendChild(toggle);
    document.body.appendChild(titleBar);

    toggle.addEventListener("click", function (event) {
        event.preventDefault();

        const isOpen =
            document.body.classList.toggle("header-visible");

        toggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );
    });

    document.querySelectorAll("#header nav a").forEach(function (link) {
        link.addEventListener("click", function () {
            document.body.classList.remove("header-visible");
            toggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            document.body.classList.remove("header-visible");
            toggle.setAttribute("aria-expanded", "false");
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeProjectMobileMenu
    );
} else {
    initializeProjectMobileMenu();
}