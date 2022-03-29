import { AppShell, Navbar, Box, Group, ActionIcon, Divider, Text, useMantineColorScheme, Center } from "@mantine/core";
import { useEffect, useState } from "react";
import { Sun, MoonStars } from "tabler-icons-react";
import EText from "~/components/impl/EText";
import { icon_size, scale } from "~/root";
import stater from "~/stater";

export default function () {

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const [setup, setSetup] = useState(false);

    useEffect(() => {
        if (setup) return; setSetup(true);

        window.onclick = (e) => {
            let parent: HTMLElement | undefined | null = e.target as HTMLElement;
            while (parent && parent !== document.body) {

                if (parent.classList.contains("edit-root")) {
                    stater.emit('activate', parent);
                    break;
                }

                if (parent.classList.contains('editor-ignore')) {
                    parent = null;
                    break;
                }

                parent = parent.parentElement || undefined;
            }

            if (parent === null) return;
            if (!parent || parent === document.body) {
                stater.emit('activate', false);
            }
        }

    })

    return (
        <AppShell
            navbar={
                <Navbar height={600} p="xs" width={{ base: 300 }} styles={{ root: { height: 'auto' } }}>
                    <Navbar.Section>
                        <Group position="apart">
                            <Text weight={800} sx={(theme) => ({ color: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.dark[9], fontSize: icon_size })}>Self</Text>
                            <ActionIcon variant="light" color={colorScheme === 'dark' ? 'indigo' : 'yellow'} onClick={() => toggleColorScheme()} size={icon_size}>
                                {colorScheme === 'dark' ? <Sun size={icon_size * scale} /> : <MoonStars size={icon_size * scale} />}
                            </ActionIcon>
                        </Group>
                        <Divider />
                    </Navbar.Section>
                    <Navbar.Section grow mt="md">{/* Links sections */}</Navbar.Section>
                    <Navbar.Section>
                        <Text size="xs" color="dimmed">
                            &copy; {new Date().getFullYear()} SelfSite, CactiveNetwork. <br />
                            All rights reserved.
                        </Text>
                    </Navbar.Section>
                </Navbar>
            }
            styles={{
                root: { height: '100vh' },
                body: { height: '100%' },
                main: { padding: '0' }
            }}
        >
            <Box sx={(theme) => ({ height: '100%', background: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0] })}>
                <Center style={{ height: '100%' }}>
                    <EText text="Goated with sauce." />
                </Center>
            </Box>
        </AppShell>
    )
}