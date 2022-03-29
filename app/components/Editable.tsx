import { ActionIcon, Box, Group, Popover, Space, ThemeIcon, Tooltip } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ArrowsHorizontal, ChevronsDown, ChevronsLeft, ChevronsRight, ChevronsUp } from "tabler-icons-react";
import stater from "~/stater";

export type EditableMeta = {
    align?: 'center' | 'flex-star' | 'flex-end';

    width?: number;
    height?: number;
    widthOverwrite?: string;
    heightOverwrite?: string;

}
function Editable(this: any, { children, tools, onActive, data }: {
    children: JSX.Element | JSX.Element[],
    tools?: JSX.Element[],
    onActive?: (active: boolean) => void,
    data?: { [key: string]: any }
}) {

    const that: any = this;

    const ref = useRef<HTMLDivElement>(null);
    const [isActive, _setActive] = useState(false);
    const [showPop, setShowPop] = useState(false);
    const setActive = (active: boolean) => {
        _setActive(active);
        setShowPop(true);
        onActive && onActive(active);
    }

    const [meta, setMeta] = useState<EditableMeta>(data ?? { widthOverwrite: '100%', heightOverwrite: '100%' });

    useMemo(() => {

        stater.on('activate', (active) => {
            setActive(active === ref.current);
            stater.emit('selected', that);
        });

        stater.on('meta_current', (k, v) => {
            setMeta({ ...meta, [k]: v });
        })

    }, [])

    function ResizeAnchors({ }) {

        const right = useRef<HTMLDivElement>(null);
        const top = useRef<HTMLDivElement>(null);
        const left = useRef<HTMLDivElement>(null);
        const bottom = useRef<HTMLDivElement>(null);

        const thickness = 24;
        const spacing = 10;

        useEffect(() => {

            const container = ref.current!;
            const [r_right, r_top, r_left, r_bottom] = [right, top, left, bottom].map(r => r.current!);

            const styles = window.getComputedStyle(container);
            let [width, height] = [parseInt(styles.width, 10), parseInt(styles.height, 10)];
            let [x, y] = [0, 0];

            const r_move = (event: MouseEvent) => {
                const dx = event.clientX - x;
                x = event.clientX;
                width = width + dx;
                container.style.width = `${width}px`;
                stater.emit('resize');
            }

            const r_up = (_event: MouseEvent) => {
                document.removeEventListener('mousemove', r_move);
                setShowPop(true);
            }

            const r_down = (event: MouseEvent) => {
                x = event.clientX;
                container.style.left = styles.left;
                container.style.right = '';
                document.addEventListener('mousemove', r_move);
                document.addEventListener('mouseup', r_up);
                setShowPop(false);
            }

            const t_move = (event: MouseEvent) => {
                const dy = event.clientY - y;
                y = event.clientY;
                height = height - dy;
                container.style.height = `${height}px`;
                stater.emit('resize');
            }

            const t_up = (_event: MouseEvent) => {
                document.removeEventListener('mousemove', t_move);
                setShowPop(true);
            }

            const t_down = (event: MouseEvent) => {
                y = event.clientY;
                container.style.bottom = styles.bottom;
                container.style.top = '';
                document.addEventListener('mousemove', t_move);
                document.addEventListener('mouseup', t_up);
                setShowPop(false);
            }

            const l_move = (event: MouseEvent) => {
                const dx = event.clientX - x;
                x = event.clientX;
                width = width - dx;
                container.style.width = `${width}px`;
                stater.emit('resize');
            }

            const l_up = (_event: MouseEvent) => {
                document.removeEventListener('mousemove', l_move);
                setShowPop(true);
            }

            const l_down = (event: MouseEvent) => {
                x = event.clientX;
                container.style.right = styles.left;
                container.style.left = '';
                document.addEventListener('mousemove', l_move);
                document.addEventListener('mouseup', l_up);
                setShowPop(false);
            }

            const b_move = (event: MouseEvent) => {
                const dy = event.clientY - y;
                y = event.clientY;
                height = height + dy;
                container.style.height = `${height}px`;
                stater.emit('resize');
            }

            const b_up = (_event: MouseEvent) => {
                document.removeEventListener('mousemove', b_move);
                setShowPop(true);
            }

            const b_down = (event: MouseEvent) => {
                y = event.clientY;
                container.style.bottom = '';
                container.style.top = styles.bottom;
                document.addEventListener('mousemove', b_move);
                document.addEventListener('mouseup', b_up);
                setShowPop(false);
            }

            // Add listeners
            r_right.addEventListener('mousedown', r_down);
            r_top.addEventListener('mousedown', t_down);
            r_left.addEventListener('mousedown', l_down);
            r_bottom.addEventListener('mousedown', b_down);

            return () => {
                r_right.removeEventListener('mousedown', r_down);
                r_top.removeEventListener('mousedown', t_down);
                r_left.removeEventListener('mousedown', l_down);
                r_bottom.removeEventListener('mousedown', b_down);
            }

        }, [])

        return (
            <>
                <div ref={right}
                    style={{
                        display: 'grid',
                        placeItems: 'center',
                        position: 'absolute',
                        height: '100%',
                        right: -(thickness + spacing),
                        cursor: 'col-resize'
                    }}
                >
                    <ThemeIcon variant="light" color="gray" >
                        <ChevronsRight size={thickness} />
                    </ThemeIcon>
                </div>
                <div
                    ref={top}
                    style={{
                        display: 'grid',
                        placeItems: 'center',
                        position: 'absolute',
                        width: '100%',
                        top: -(thickness + spacing),
                        cursor: 'row-resize'
                    }}
                >
                    <ThemeIcon variant="light" color="gray" >
                        <ChevronsUp size={thickness} />
                    </ThemeIcon>
                </div>
                <div ref={left}
                    style={{
                        display: 'grid',
                        placeItems: 'center',
                        position: 'absolute',
                        height: '100%',
                        left: -(thickness + spacing),
                        cursor: 'col-resize'
                    }}
                >
                    <ThemeIcon variant="light" color="gray" >
                        <ChevronsLeft size={thickness} />
                    </ThemeIcon>
                </div>
                <div
                    ref={bottom}
                    style={{
                        display: 'grid',
                        placeItems: 'center',
                        position: 'absolute',
                        width: '100%',
                        bottom: -(thickness + spacing),
                        cursor: 'row-resize'
                    }}
                >
                    <ThemeIcon variant="light" color="gray" >
                        <ChevronsDown size={thickness} />
                    </ThemeIcon>
                </div>
            </>
        )
    }

    function DefaultTools({ }) {
        return (
            <>
                <Tooltip
                    label="Full width"
                    withArrow
                >
                    <ActionIcon
                        onClick={() => setMeta({ ...meta, widthOverwrite: '100%' })}
                    >
                        <ArrowsHorizontal />
                    </ActionIcon>
                </Tooltip>
            </>
        )
    }

    return (
        <>
            <Popover
                opened={isActive && showPop}
                position="bottom"
                gutter={40}
                target={
                    <Box className="edit-root" ref={ref} sx={(t) => ({

                        position: 'relative',

                        width: meta.widthOverwrite ?? (meta.width ? meta.width + 'px' : '100px'),
                        height: meta.heightOverwrite ?? (meta.height ? meta.height + 'px' : '100px'),

                        padding: isActive ? 0 : 1,
                        borderWidth: isActive ? 1 : 0,

                        borderColor: t.colorScheme === 'dark' ? t.colors.blue[4] : t.colors.blue[7],
                        borderStyle: 'solid',
                    })}>
                        {isActive && <ResizeAnchors />}
                        {children}
                    </Box>
                }
            >
                <Group
                    className="editor-ignore"
                    direction="row"
                    position="center"
                >
                    <DefaultTools />
                    {tools}
                </Group>
            </Popover>
        </>
    )


}

export default Editable;