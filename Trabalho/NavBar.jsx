import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    TextField,
    InputAdornment,
} from "@mui/material";

import {
    Home,
    PieChart,
    Settings,
    Help,
    Search,
} from "@mui/icons-material";

const drawerWidth = 240;

import { useEffect } from "react";

export default function DashboardLayout() {
    useEffect(() => {
        const link = document.createElement("link");
        link.href =
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
        link.rel = "stylesheet";

        document.head.appendChild(link);
    }, []);

    return (
        <Box sx={{ display: "flex", fontFamily: "Inter, sans-serif" }}>
            {/* TOP BAR */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: 1201,
                    backgroundColor: "#0f172a",
                    fontFamily: "Inter, sans-serif",
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    {/* LOGO */}
                    <Box
                        component="a"
                        href="/"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            component="img"
                            src="/logo.png"
                            alt="Logo"
                            sx={{
                                height: 52,
                                width: "auto",
                            }}
                        />
                    </Box>

                    {/* BUSCA */}
                    <TextField
                        placeholder="Buscar transações e categorias..."
                        size="small"
                        variant="outlined"
                        sx={{
                            width: 400,

                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#1e293b",
                                color: "#fff",
                                borderRadius: "999px",
                                paddingLeft: 1.5,

                                "& fieldset": {
                                    border: "none",
                                },

                                "&:hover fieldset": {
                                    border: "none",
                                },

                                "&.Mui-focused fieldset": {
                                    border: "none",
                                },
                            },

                            "& input::placeholder": {
                                color: "#94a3b8",
                                opacity: 1,
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ ml: 1 }}>
                                    <Search sx={{ color: "#94a3b8" }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* USER */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Typography>Gabi</Typography>
                        <Avatar sx={{ width: 32, height: 32 }}>G</Avatar>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* SIDEBAR */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,

                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "#0b1220",
                        color: "#fff",
                        fontFamily: "Inter, sans-serif",
                    },
                }}
            >
                <Toolbar />

                {/* CONTAINER FLEX */}
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    {/* MENU DE CIMA */}
                    <Box sx={{ mt: 2 }}>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon sx={{ color: "#fff" }}>
                                        <Home />
                                    </ListItemIcon>
                                    <ListItemText primary="Início" />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon sx={{ color: "#fff" }}>
                                        <PieChart />
                                    </ListItemIcon>
                                    <ListItemText primary="Orçamento" />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon sx={{ color: "#fff" }}>
                                        <Settings />
                                    </ListItemIcon>
                                    <ListItemText primary="Configurações" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>

                    {/* AJUDA EMBAIXO */}
                    <Box>
                        <Divider sx={{ backgroundColor: "#1f2937", my: 2 }} />

                        <List>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon sx={{ color: "#fff" }}>
                                        <Help />
                                    </ListItemIcon>
                                    <ListItemText primary="Ajuda" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Box>
            </Drawer>

            {/* CONTEÚDO */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: "#f3f4f6",
                    minHeight: "100vh",
                    fontFamily: "Inter, sans-serif",
                }}
            >
                <Toolbar />
                <Typography variant="h4">
                    Dashboard aqui...
                </Typography>
            </Box>
        </Box>
    );
}
