import Editable, { EditableMeta } from "../Editable";
import { ActionIcon, ColorPicker, ColorSwatch, Popover, Text, Tooltip } from "@mantine/core";
import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, CodePlus } from "tabler-icons-react";
import stater from "~/stater";

const icons = require("tabler-icons-react");

type TextMeta = EditableMeta & {
    text_align?: "left" | "center" | "right";
    font_size?: number;
    font_full?: boolean;
    font_size_overwrite?: number;
    color?: `#${string}`;
}

export default function EText({ text, data }: { text?: string, data?: { [key: string]: any } }) {

    const [meta, setMeta] = useState<TextMeta>(data ?? {});
    const [colorOpened, setColorOpened] = useState(false);
    const [set, setSet] = useState<boolean>(false);

    const ref = useRef<HTMLDivElement>(null);
    const stateRef = useRef<TextMeta>(meta);
    stateRef.current = meta;

    useEffect(() => {

        if (set) return;
        setSet(true);

        stater.on('resize', () => {
            const text = ref.current!;

            if (!text) return;
            if (!stateRef.current!.font_full) return;

            const { width, height } = text.getBoundingClientRect();
            setMeta({ ...stateRef.current!, font_size_overwrite: Math.min(width, height) / 2 });

        })
    })

    function Alignment({ alignment }: { alignment: NonNullable<TextMeta['text_align']> }) {
        return (
            <Tooltip
                label={"Text " + alignment}
                withArrow
            >
                <ActionIcon
                    variant="light"
                    color={meta.text_align == alignment ? "blue" : "gray"}
                    onClick={() => setMeta({ ...meta, text_align: alignment })}
                >
                    {icons[`Align${alignment[0].toUpperCase()}${alignment.slice(1)}`]({})}
                </ActionIcon>
            </Tooltip>
        )
    }

    return (
        <Editable
            tools={[
                <Alignment alignment="left" />,
                <Alignment alignment="center" />,
                <Alignment alignment="right" />,
                <Tooltip
                    label="Smaller"
                    withArrow
                >
                    <ActionIcon
                        onClick={() => setMeta({ ...meta, font_full: false, font_size_overwrite: undefined, font_size: (meta.font_size_overwrite ?? meta.font_size ?? 14) - 1 })}
                    >
                        <Minus />
                    </ActionIcon>
                </Tooltip>,
                <Tooltip
                    label="Larger"
                    withArrow
                >
                    <ActionIcon
                        onClick={() => setMeta({ ...meta, font_full: false, font_size_overwrite: undefined, font_size: (meta.font_size_overwrite ?? meta.font_size ?? 14) + 1 })}
                    >
                        <Plus />
                    </ActionIcon>
                </Tooltip>,
                <Tooltip
                    label="Fit"
                    withArrow
                >
                    <ActionIcon
                        variant="light"
                        color={meta.font_full ? "blue" : "gray"}
                        onClick={() => { setMeta({ ...meta, font_full: true }); stater.emit('resize') }}
                    >
                        <CodePlus />
                    </ActionIcon>
                </Tooltip>,
                <Popover
                    withArrow
                    position="right"
                    opened={colorOpened}
                    onClose={() => setColorOpened(false)}
                    target={
                        <ColorSwatch
                            style={{ cursor: 'pointer' }}
                            color={meta.color ?? '#ffffff'}
                            onClick={() => setColorOpened(true)}
                        />
                    }
                >
                    <ColorPicker
                        className="editor-ignore"
                        format="hex"
                        value={meta.color ?? '#ffffff'}
                        onChange={v => {
                            console.log(v);
                            setMeta({
                                ...meta, color: v as `#${string}`
                            })
                        }}
                    />
                </Popover>
            ]}
        >
            <Text
                ref={ref}
                contentEditable
                spellCheck={false}
                suppressContentEditableWarning={true}
                sx={(theme) => ({
                    color: meta.color ?? (theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9]),
                    textAlign: meta.text_align ?? "left",
                    fontSize: meta.font_size_overwrite ?? meta.font_size ?? 14,
                    width: "100%",
                    maxWidth: "100%",
                    height: '100%',
                    maxHeight: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    outline: 'none',
                    border: 'none',
                })}
            >
                {text}
            </Text>
        </Editable>
    )

}