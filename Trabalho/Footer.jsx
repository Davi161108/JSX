import {
    Box,
    Container,
    Grid,
    Typography,
    IconButton,
    Stack,
    Button,
} from "@mui/material";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";

import {
    Facebook,
    Instagram,
    LinkedIn,
    YouTube,
    Twitter,
    Pinterest,
} from "@mui/icons-material";

export default function Footer() {

    return (
        <Box
            sx={{
                backgroundColor:"rgb(19, 17, 37)",
                color: "#fff",
                pt: 6,
                pb: 3,
                position: "relative",
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={14}>
                    {/* Apps */}
                    <Grid item xs={12} md={3}>
                        <Stack spacing={2}>
                            <Button
                                variant="outlined"
                                startIcon={<AppleIcon />}
                                sx={{ color: "#fff", borderColor: "#fff" }}
                            >
                                App Store
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={<AndroidIcon />}
                                sx={{ color: "#fff", borderColor: "#fff" }}
                            >
                                Google Play
                            </Button>
                        </Stack>
                    </Grid>

                    {/* Produtos financeiros */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom>
                            Produtos financeiros
                        </Typography>
                        {["Cartão de crédito", "Empréstimo", "Calculadoras", "Contas digitais"].map(
                            (item) => (
                                <Typography key={item} variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                                    {item}
                                </Typography>
                            )
                        )}
                    </Grid>

                    {/* Institucional */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom>
                            Institucional
                        </Typography>
                        {[
                            "Blog",
                            "Sobre nós",
                            "Trabalhe conosco",
                            "Termos e Privacidade",
                            "Seja Parceiro",
                            "Central de Denúncias",
                        ].map((item) => (
                            <Typography key={item} variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                                {item}
                            </Typography>
                        ))}
                    </Grid>

                    {/* Ajuda + WhatsApp */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom>
                            Ajuda
                        </Typography>

                        {["Ouvidoria", "Fale conosco"].map((item) => (
                            <Typography key={item} variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                                {item}
                            </Typography>
                        ))}

                        
                    </Grid>
                </Grid>

                {/* Bottom bar */}
                <Box
                    sx={{
                        mt: 5,
                        pt: 3,
                        borderTop: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        © 2026 Sua Empresa. Todos os direitos reservados.
                    </Typography>

                    {/* Social icons */}
                    <Stack direction="row" spacing={1}>
                        <IconButton sx={{ color: "#fff" }}>
                            <YouTube />
                        </IconButton>
                        <IconButton sx={{ color: "#fff" }}>
                            <LinkedIn />
                        </IconButton>
                        <IconButton sx={{ color: "#fff" }}>
                            <Facebook />
                        </IconButton>
                        <IconButton sx={{ color: "#fff" }}>
                            <Instagram />
                        </IconButton>
                        <IconButton sx={{ color: "#fff" }}>
                            <Twitter />
                        </IconButton>
                        <IconButton sx={{ color: "#fff" }}>
                            <Pinterest />
                        </IconButton>
                    </Stack>
                </Box>
            </Container>

            {/* WhatsApp floating button style (igual inspiração) */}
            <Box
                sx={{
                    position: "absolute",
                    right: 20,
                    top: 120,
                    backgroundColor: "#4b2aad",
                    borderRadius: 2,
                    p: 1.5,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    transition: "0.3s",
                }}
            >
                <WhatsAppIcon />
                <Typography variant="body2">WhatsApp</Typography>
            </Box>

        </Box>
    );
}
