import {
    createIntegration,
    createComponent,
    FetchEventCallback,
    RuntimeContext,
} from "@gitbook/runtime";

type IntegrationContext = {} & RuntimeContext;

type IntegrationBlockProps = {
    name?: string;
    imageUrl?: string;

    row1Label?: string;
    row1Value?: string;
    row2Label?: string;
    row2Value?: string;
    row3Label?: string;
    row3Value?: string;
    row4Label?: string;
    row4Value?: string;
    row5Label?: string;
    row5Value?: string;
    row6Label?: string;
    row6Value?: string;
    row7Label?: string;
    row7Value?: string;
    row8Label?: string;
    row8Value?: string;
    row9Label?: string;
    row9Value?: string;
    row10Label?: string;
    row10Value?: string;
};

type IntegrationBlockState = {
    name: string;
    imageUrl: string;

    row1Label: string;
    row1Value: string;
    row2Label: string;
    row2Value: string;
    row3Label: string;
    row3Value: string;
    row4Label: string;
    row4Value: string;
    row5Label: string;
    row5Value: string;
    row6Label: string;
    row6Value: string;
    row7Label: string;
    row7Value: string;
    row8Label: string;
    row8Value: string;
    row9Label: string;
    row9Value: string;
    row10Label: string;
    row10Value: string;
};

type IntegrationAction = {
    action: string;
};

const INFOBOX_HTML = `<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    />

    <style>
        :root {
            color-scheme: light dark;
        }

        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            overflow: hidden;
            background: transparent;
        }

        body {
            box-sizing: border-box;
            font-family:
                ui-sans-serif,
                system-ui,
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                sans-serif;
            font-size: 14px;
            line-height: 1.45;
        }

        *,
        *::before,
        *::after {
            box-sizing: inherit;
        }

        #root {
            width: 100%;
        }

        #image {
            display: block;
            width: 100%;
            height: auto;
            max-height: 380px;
            object-fit: contain;
            object-position: center;
            margin: 0 0 12px 0;
        }

        #image[hidden] {
            display: none;
        }

        #rows {
            width: 100%;
        }

        .row {
            display: grid;
            grid-template-columns:
                minmax(0, 1fr)
                minmax(0, 2fr);
            width: 100%;
            border-top: 1px solid rgba(127, 127, 127, 0.25);
        }

        .label,
        .value {
            min-width: 0;
            padding: 8px 10px;
            overflow-wrap: anywhere;
        }

        .label {
            font-weight: 700;
        }

        @media (max-width: 420px) {
            .row {
                grid-template-columns:
                    minmax(0, 2fr)
                    minmax(0, 3fr);
            }

            .label,
            .value {
                padding: 7px 8px;
            }
        }
    </style>
</head>

<body>
    <div id="root">
    <div id="test-marker">FRAME LOADED</div>
    <img id="image" hidden />
    <div id="rows"></div>
</div>

    <script>
        var root = document.getElementById("root");
        var image = document.getElementById("image");
        var rows = document.getElementById("rows");

        function sendResize() {
            requestAnimationFrame(function () {
                var rect = root.getBoundingClientRect();

                var width = Math.max(
                    Math.ceil(rect.width),
                    1
                );

                var height = Math.max(
                    Math.ceil(rect.height),
                    1
                );

                window.parent.postMessage(
                    {
                        action: "@webframe.resize",
                        aspectRatio: width / height,
                        maxHeight: height
                    },
                    "*"
                );
            });
        }

        function addRow(label, value) {
            if (!label && !value) {
                return;
            }

            var row = document.createElement("div");
            row.className = "row";

            var labelCell = document.createElement("div");
            labelCell.className = "label";
            labelCell.textContent = label;

            var valueCell = document.createElement("div");
            valueCell.className = "value";
            valueCell.textContent = value;

            row.appendChild(labelCell);
            row.appendChild(valueCell);

            rows.appendChild(row);
        }

        function renderInfobox(state) {
            state = state || {};

            var imageUrl =
                typeof state.imageUrl === "string"
                    ? state.imageUrl.trim()
                    : "";

            image.alt =
                typeof state.name === "string" &&
                state.name.trim()
                    ? state.name.trim()
                    : "Infobox image";

            if (imageUrl) {
                image.hidden = false;

                image.onload = function () {
                    sendResize();
                };

                image.onerror = function () {
                    image.hidden = true;
                    sendResize();
                };

                if (image.src !== imageUrl) {
                    image.src = imageUrl;
                }
            } else {
                image.hidden = true;
                image.removeAttribute("src");
            }

            rows.replaceChildren();

            for (var i = 1; i <= 10; i++) {
                var labelKey = "row" + i + "Label";
                var valueKey = "row" + i + "Value";

                var label =
                    typeof state[labelKey] === "string"
                        ? state[labelKey].trim()
                        : "";

                var value =
                    typeof state[valueKey] === "string"
                        ? state[valueKey].trim()
                        : "";

                addRow(label, value);
            }

            sendResize();
        }

        window.addEventListener(
            "message",
            function (event) {
                if (
                    !event.data ||
                    !event.data.state
                ) {
                    return;
                }

                renderInfobox(event.data.state);
            }
        );

        if ("ResizeObserver" in window) {
            var observer =
                new ResizeObserver(function () {
                    sendResize();
                });

            observer.observe(root);
        }

        window.parent.postMessage(
            {
                action: "@webframe.ready"
            },
            "*"
        );
    </script>
</body>
</html>`;

const handleFetchEvent: FetchEventCallback<IntegrationContext> = async (
    request,
    context
) => {
    const url = new URL(request.url);

    if (
        request.method === "GET" &&
        url.pathname.endsWith("/infobox.html")
    ) {
        return new Response(INFOBOX_HTML, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "no-store",
            },
        });
    }

    return new Response("Not found", {
        status: 404,
    });
};

const infoboxBlock = createComponent<
    IntegrationBlockProps,
    IntegrationBlockState,
    IntegrationAction,
    IntegrationContext
>({
    componentId: "needleskip-infobox",

    initialState: (props) => ({
        name: props.name ?? "Infobox",
        imageUrl: props.imageUrl ?? "",

        row1Label: props.row1Label ?? "",
        row1Value: props.row1Value ?? "",
        row2Label: props.row2Label ?? "",
        row2Value: props.row2Value ?? "",
        row3Label: props.row3Label ?? "",
        row3Value: props.row3Value ?? "",
        row4Label: props.row4Label ?? "",
        row4Value: props.row4Value ?? "",
        row5Label: props.row5Label ?? "",
        row5Value: props.row5Value ?? "",
        row6Label: props.row6Label ?? "",
        row6Value: props.row6Value ?? "",
        row7Label: props.row7Label ?? "",
        row7Value: props.row7Value ?? "",
        row8Label: props.row8Label ?? "",
        row8Value: props.row8Value ?? "",
        row9Label: props.row9Label ?? "",
        row9Value: props.row9Value ?? "",
        row10Label: props.row10Label ?? "",
        row10Value: props.row10Value ?? "",
    }),

    action: async () => ({}),

    render: async (element, context) => {
        const editable =
            element.context.type === "document" &&
            element.context.editable;

        const infoboxUrl =
    "https://sixth-capital-letting-skirts.trycloudflare.com/infobox.html";

return (
            <block>
                <card
                    title={
                        element.props.name ??
                        "Infobox"
                    }
                >
                    <webframe
    source={{
        url: infoboxUrl,
    }}
                        data={{
                            name:
                                element.props.name ??
                                "",

                            imageUrl:
                                element.props.imageUrl ??
                                "",

                            row1Label:
                                element.props.row1Label ??
                                "",
                            row1Value:
                                element.props.row1Value ??
                                "",

                            row2Label:
                                element.props.row2Label ??
                                "",
                            row2Value:
                                element.props.row2Value ??
                                "",

                            row3Label:
                                element.props.row3Label ??
                                "",
                            row3Value:
                                element.props.row3Value ??
                                "",

                            row4Label:
                                element.props.row4Label ??
                                "",
                            row4Value:
                                element.props.row4Value ??
                                "",

                            row5Label:
                                element.props.row5Label ??
                                "",
                            row5Value:
                                element.props.row5Value ??
                                "",

                            row6Label:
                                element.props.row6Label ??
                                "",
                            row6Value:
                                element.props.row6Value ??
                                "",

                            row7Label:
                                element.props.row7Label ??
                                "",
                            row7Value:
                                element.props.row7Value ??
                                "",

                            row8Label:
                                element.props.row8Label ??
                                "",
                            row8Value:
                                element.props.row8Value ??
                                "",

                            row9Label:
                                element.props.row9Label ??
                                "",
                            row9Value:
                                element.props.row9Value ??
                                "",

                            row10Label:
                                element.props.row10Label ??
                                "",
                            row10Value:
                                element.props.row10Value ??
                                "",
                        }}
                    />
                </card>

                {editable
                    ? [
                          <textinput
                              state="name"
                              placeholder="Infobox title"
                          />,

                          <textinput
                              state="imageUrl"
                              placeholder="Image URL"
                          />,

                          <textinput
                              state="row1Label"
                              placeholder="Row 1 label"
                          />,

                          <textinput
                              state="row1Value"
                              placeholder="Row 1 value"
                          />,

                          <textinput
                              state="row2Label"
                              placeholder="Row 2 label"
                          />,

                          <textinput
                              state="row2Value"
                              placeholder="Row 2 value"
                          />,

                          <textinput
                              state="row3Label"
                              placeholder="Row 3 label"
                          />,

                          <textinput
                              state="row3Value"
                              placeholder="Row 3 value"
                          />,

                          <textinput
                              state="row4Label"
                              placeholder="Row 4 label"
                          />,

                          <textinput
                              state="row4Value"
                              placeholder="Row 4 value"
                          />,

                          <textinput
                              state="row5Label"
                              placeholder="Row 5 label"
                          />,

                          <textinput
                              state="row5Value"
                              placeholder="Row 5 value"
                          />,

                          <textinput
                              state="row6Label"
                              placeholder="Row 6 label"
                          />,

                          <textinput
                              state="row6Value"
                              placeholder="Row 6 value"
                          />,

                          <textinput
                              state="row7Label"
                              placeholder="Row 7 label"
                          />,

                          <textinput
                              state="row7Value"
                              placeholder="Row 7 value"
                          />,

                          <textinput
                              state="row8Label"
                              placeholder="Row 8 label"
                          />,

                          <textinput
                              state="row8Value"
                              placeholder="Row 8 value"
                          />,

                          <textinput
                              state="row9Label"
                              placeholder="Row 9 label"
                          />,

                          <textinput
                              state="row9Value"
                              placeholder="Row 9 value"
                          />,

                          <textinput
                              state="row10Label"
                              placeholder="Row 10 label"
                          />,

                          <textinput
                              state="row10Value"
                              placeholder="Row 10 value"
                          />,

                          <button
                              label="Save infobox"
                              onPress={{
                                  action:
                                      "@editor.node.updateProps",

                                  props: {
                                      name:
                                          element.dynamicState(
                                              "name"
                                          ),

                                      imageUrl:
                                          element.dynamicState(
                                              "imageUrl"
                                          ),

                                      row1Label:
                                          element.dynamicState(
                                              "row1Label"
                                          ),

                                      row1Value:
                                          element.dynamicState(
                                              "row1Value"
                                          ),

                                      row2Label:
                                          element.dynamicState(
                                              "row2Label"
                                          ),

                                      row2Value:
                                          element.dynamicState(
                                              "row2Value"
                                          ),

                                      row3Label:
                                          element.dynamicState(
                                              "row3Label"
                                          ),

                                      row3Value:
                                          element.dynamicState(
                                              "row3Value"
                                          ),

                                      row4Label:
                                          element.dynamicState(
                                              "row4Label"
                                          ),

                                      row4Value:
                                          element.dynamicState(
                                              "row4Value"
                                          ),

                                      row5Label:
                                          element.dynamicState(
                                              "row5Label"
                                          ),

                                      row5Value:
                                          element.dynamicState(
                                              "row5Value"
                                          ),

                                      row6Label:
                                          element.dynamicState(
                                              "row6Label"
                                          ),

                                      row6Value:
                                          element.dynamicState(
                                              "row6Value"
                                          ),

                                      row7Label:
                                          element.dynamicState(
                                              "row7Label"
                                          ),

                                      row7Value:
                                          element.dynamicState(
                                              "row7Value"
                                          ),

                                      row8Label:
                                          element.dynamicState(
                                              "row8Label"
                                          ),

                                      row8Value:
                                          element.dynamicState(
                                              "row8Value"
                                          ),

                                      row9Label:
                                          element.dynamicState(
                                              "row9Label"
                                          ),

                                      row9Value:
                                          element.dynamicState(
                                              "row9Value"
                                          ),

                                      row10Label:
                                          element.dynamicState(
                                              "row10Label"
                                          ),

                                      row10Value:
                                          element.dynamicState(
                                              "row10Value"
                                          ),
                                  },
                              }}
                          />,
                      ]
                    : null}
            </block>
        );
    },
});

export default createIntegration({
    fetch: handleFetchEvent,
    components: [infoboxBlock],
    events: {},
});