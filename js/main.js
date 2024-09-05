const copyText = document.getElementById("linkUrl"),
revealEffect = document.querySelectorAll('.reveal'),
frame = document.querySelector("iframe"),
copyLink = document.querySelector("#copyLink");

(() => {
    setTimeout(() => {
        document.querySelector("#pfp").classList.add("float-effect");
    }, 1000);

    ["bu", "iu", "color", "fontcolor"].forEach((e) => {
        let locVal = localStorage.getItem(e);
        console.log("loc", e, locVal);
        if (locVal) {
            document.querySelector('input[name="' + e + '"]').value =
                localStorage.getItem(e);
        }
    });

    const locAlpha = localStorage.getItem("alpha");
    console.log(locAlpha);
    document.querySelector('input[name="alpha"]').checked =
        locAlpha && locAlpha != "false";
})();

document.querySelectorAll("#closeDropdown, #toggleMenu").forEach((e) =>
    e.addEventListener("click", () => {
        const menu = document.querySelector("#menu");
        if (menu.classList.contains("hidden")) {
            menu.classList.remove("hidden");
            menu.classList.add("flex", "reveal-r", "active");
            return;
        }
        menu.classList.add("hidden");
        menu.classList.remove("flex", "reveal-r", "active");
    })
);

copyLink.addEventListener("click", () => {
    if (!copyText.value) return;
    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
});

copyText.addEventListener("focus", (e) => {
    e.target.select();
    e.target.setSelectionRange(0, 99999);
});

const fields = document.querySelectorAll("input[name], select[name"),
    validationRule = {
        default: (v, k) => !k || !!v?.length,
        color: (v, k) => {
            localStorage.setItem(k, v);
            return [true, v.replace("#", "")];
        },
        fontcolor: (v, k) => validationRule.color(v, k),
        alpha: (v, k) => {
            localStorage.setItem(k, v);
            return [true, v ? "ss" : "nn"];
        },

        bu: (v, k) => {
            localStorage.setItem(k, v || "");
            return [true, encodeURIComponent(v || "")];
        },
        iu: (v, k) => validationRule.bu(v, k),
    };

let timeoutQuery;
fields.forEach((e) => {
    e.addEventListener("keyup", changes)
    e.addEventListener("change", changes)

}
);

function changes() {
    if (!isValid()) {
        copyText.value = "";
        copyLink.classList.add("hidden");
        frame.classList.add("hidden");
        return;
    }
    const farea = document.getElementById("frame-area");
    farea.classList.add("loading");
    frame.classList.add("hidden");

    if (timeoutQuery) clearTimeout(timeoutQuery);

    timeoutQuery = setTimeout(() => {
        let requestParams = {};
        farea.classList.remove("loading");

        if (isValid(requestParams)) {
            console.log("requestParams", requestParams);
            let params = "";
            for (let x in requestParams) {
                params += `${x}=${requestParams[x]}&`;
            }
            params = params.slice(0, -1);
            console.log("params", params);
            copyLink.classList.remove("hidden");

            frame.classList.remove("hidden");
            frame.src = copyText.value =
                window.location.origin +
                //"https://davizeragod.github.io" + 
                "/v2/main.html?" + params;
            console.log("update");
            return;
        }
    }, 2000);
}

function isValid(requestParams = {}) {
    return [...fields].every((e) => {
        let u = (validationRule[e.name] || validationRule.default)(
            e.getAttribute("type") == "checkbox" ? e.checked : e.value,
            e.name
        );
        console.log(e.name, u);
        if (typeof u === "boolean") {
            requestParams[e.name] = e.value;
            return u;
        }

        const [bol, newVal] = u;

        requestParams[e.name] = newVal;
        return bol;
    });
}


 // Text Observer
 const observer = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		// Check if the target element is at least 15% visible
		if (entry.intersectionRatio >= 0.2) {
			entry.target.classList.add("active");
		} else {
			entry.target.classList.remove("active");
		}
	});
}, { threshold: 0.2 });

for (var i = 0; i < revealEffect.length; i++) {
	observer.observe(revealEffect[i]);
}
