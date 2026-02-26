import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  alpha,
  Avatar,
  Stack,
  Divider,
  Collapse,
  Chip,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home,
  Info,
  Article,
  Close,
  ExpandLess,
  ExpandMore,
  Dashboard,
  Celebration,
  Group,
  Quiz,
  Login,
  PersonAdd,
  Settings,
  Help,
  Logout,
  Event,
  Whatshot,
} from "@mui/icons-material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  // AndEvent red theme colors
  const andEventColors = {
    primary: "#DC2626", // Vibrant Red
    secondary: "#B91C1C", // Dark Red
    accent: "#EF4444", // Bright Red
    light: "#FEE2E2", // Light Red for backgrounds
    dark: "#7F1D1D", // Deep Red
    gradient: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)",
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { path: "/", label: "Home", icon: <Celebration />, end: true },
    { path: "/events", label: "Events", icon: <Event /> },
    { path: "/about", label: "About", icon: <Info /> },
    { path: "/contact", label: "Contact", icon: <Article /> },
  ];

  // Helper function to check if a link is active
  const isActive = (path, end = false) => {
    if (end) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path) && path !== "/";
  };

  // Mobile drawer content - Updated with red theme
  const drawer = (
    <Box
      sx={{
        width: 300,
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(
          andEventColors.dark,
          0.95,
        )} 0%, ${alpha(andEventColors.primary, 0.95)} 100%)`,
        color: "white",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          p: 2,
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar
            sx={{
              background: andEventColors.gradient,
              width: 40,
              height: 40,
            }}
          >
            <Celebration sx={{ fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={900} sx={{ color: "white" }}>
              AndEvent
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: alpha(theme.palette.common.white, 0.7) }}
            >
              Event Platform
            </Typography>
          </Box>
        </Stack>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: "white",
            "&:hover": { bgcolor: alpha(andEventColors.accent, 0.2) },
          }}
        >
          <Close />
        </IconButton>
      </Stack>

      <List sx={{ p: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                bgcolor: isActive(item.path, item.end)
                  ? alpha(andEventColors.accent, 0.2)
                  : "transparent",
                color: "white",
                "&:hover": {
                  bgcolor: alpha(andEventColors.accent, 0.1),
                },
                transition: "all 0.3s ease",
              }}
            >
              <Box
                component="span"
                sx={{
                  mr: 2,
                  display: "flex",
                  color: isActive(item.path, item.end)
                    ? andEventColors.accent
                    : "white",
                }}
              >
                {item.icon}
              </Box>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path, item.end) ? 700 : 500,
                }}
              />
              {isActive(item.path, item.end) && (
                <Box
                  sx={{
                    width: 4,
                    height: 30,
                    bgcolor: andEventColors.accent,
                    borderRadius: 4,
                    ml: "auto",
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}

        <Divider
          sx={{ my: 2, borderColor: alpha(theme.palette.common.white, 0.1) }}
        />

        {/* Quick Actions */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            onClick={() => {
              handleDrawerToggle();
              navigate("/host");
            }}
            sx={{
              borderRadius: 2,
              color: "white",
              "&:hover": { bgcolor: alpha(andEventColors.accent, 0.1) },
            }}
          >
            <Box component="span" sx={{ mr: 2, display: "flex" }}>
              <Whatshot />
            </Box>
            <ListItemText primary="Host Event" />
            <Chip
              label="NEW"
              size="small"
              sx={{
                bgcolor: andEventColors.accent,
                color: "white",
                fontSize: "0.7rem",
                height: 20,
              }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setOpenSubMenu(!openSubMenu)}
            sx={{
              borderRadius: 2,
              color: "white",
              "&:hover": { bgcolor: alpha(andEventColors.accent, 0.1) },
            }}
          >
            <Box component="span" sx={{ mr: 2, display: "flex" }}>
              <Dashboard />
            </Box>
            <ListItemText primary="Resources" />
            {openSubMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {["Documentation", "API Reference", "Support"].map((text) => (
              <ListItemButton
                key={text}
                sx={{
                  pl: 7,
                  borderRadius: 2,
                  ml: 1,
                  mt: 0.5,
                  color: alpha(theme.palette.common.white, 0.8),
                  "&:hover": { bgcolor: alpha(andEventColors.accent, 0.1) },
                }}
              >
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        <Divider
          sx={{ my: 2, borderColor: alpha(theme.palette.common.white, 0.1) }}
        />

        {/* User Section */}
        <Box sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Login />}
              onClick={() => navigate("/login")}
              sx={{
                color: "white",
                borderColor: alpha(theme.palette.common.white, 0.3),
                "&:hover": {
                  borderColor: andEventColors.accent,
                  bgcolor: alpha(andEventColors.accent, 0.1),
                },
              }}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => navigate("/signup")}
              sx={{
                bgcolor: andEventColors.accent,
                "&:hover": {
                  bgcolor: andEventColors.primary,
                },
              }}
            >
              Sign Up
            </Button>
          </Stack>
        </Box>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: `linear-gradient(90deg, ${andEventColors.dark} 0%, ${andEventColors.primary} 100%)`,
        borderBottom: `1px solid ${alpha(andEventColors.accent, 0.3)}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 70 }}>
          {/* Logo/Brand - Updated with AndEvent */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <Avatar
              sx={{
                background: andEventColors.gradient,
                width: 40,
                height: 40,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1) rotate(5deg)",
                },
              }}
            >
              <Celebration sx={{ fontSize: 24 }} />
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: "white",
                letterSpacing: 1,
                display: { xs: "none", sm: "block" },
                textShadow: `0 2px 5px ${alpha(andEventColors.dark, 0.5)}`,
              }}
            >
              AndEvent
            </Typography>
          </Stack>

          {/* Desktop Navigation */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: 1,
              ml: 4,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: "white",
                  opacity: isActive(item.path, item.end) ? 1 : 0.8,
                  bgcolor: isActive(item.path, item.end)
                    ? alpha(andEventColors.accent, 0.2)
                    : "transparent",
                  "&:hover": {
                    bgcolor: alpha(andEventColors.accent, 0.1),
                    opacity: 1,
                  },
                  py: 1,
                  px: 2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: isActive(item.path, item.end) ? 700 : 500,
                  position: "relative",
                  "&::after": isActive(item.path, item.end)
                    ? {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        bgcolor: andEventColors.accent,
                      }
                    : {},
                }}
              >
                {item.label}
              </Button>
            ))}

            {/* Quick Host Button */}
            <Button
              variant="contained"
              startIcon={<Whatshot />}
              onClick={() => navigate("/host")}
              sx={{
                ml: 2,
                bgcolor: andEventColors.accent,
                color: "white",
                fontWeight: 700,
                "&:hover": {
                  bgcolor: andEventColors.primary,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Host Event
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: { md: "none" },
              ml: "auto",
              color: "white",
              "&:hover": {
                bgcolor: alpha(andEventColors.accent, 0.2),
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop Right Side Actions */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, ml: 2 }}>
            <Badge
              badgeContent={3}
              sx={{
                "& .MuiBadge-badge": {
                  bgcolor: andEventColors.accent,
                  color: "white",
                },
              }}
            >
              <IconButton
                sx={{
                  color: "white",
                  "&:hover": { bgcolor: alpha(andEventColors.accent, 0.2) },
                }}
              >
                <Quiz />
              </IconButton>
            </Badge>

            <Button
              variant="text"
              startIcon={<Login />}
              onClick={() => navigate("/login")}
              sx={{
                color: "white",
                "&:hover": {
                  bgcolor: alpha(andEventColors.accent, 0.1),
                },
              }}
            >
              Login
            </Button>

            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => navigate("/signup")}
              sx={{
                bgcolor: andEventColors.accent,
                "&:hover": {
                  bgcolor: andEventColors.primary,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Sign Up
            </Button>

            {/* User Avatar (when logged in) */}
            {/* <IconButton
              sx={{
                ml: 1,
                border: `2px solid ${alpha(andEventColors.accent, 0.5)}`,
                "&:hover": { borderColor: andEventColors.accent },
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: andEventColors.accent }}>
                U
              </Avatar>
            </IconButton> */}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 300,
            backgroundColor: "transparent",
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
