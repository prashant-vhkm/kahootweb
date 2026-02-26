import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Divider,
  Badge,
  useTheme,
  alpha,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Celebration,
  Quiz,
  Home,
  Menu as MenuIcon,
  Close,
  Leaderboard,
  Settings,
  Help,
  GitHub,
  ArrowDropDown,
  EmojiEvents,
  Event,
  Whatshot,
  Login,
  PersonAdd,
  Notifications,
  Dashboard,
  Info,
  QuestionAnswer,
} from "@mui/icons-material";

export default function AppNavbar() {
  const theme = useTheme();
  const nav = useNavigate();
  const loc = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // AndEvent red theme colors
  const andEventColors = {
    primary: "#DC2626", // Vibrant Red
    secondary: "#B91C1C", // Dark Red
    accent: "#EF4444", // Bright Red
    light: "#FEE2E2", // Light Red for backgrounds
    dark: "#7F1D1D", // Deep Red
    gradient: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)",
  };

  const go = (path) => {
    nav(path);
    setMobileMenuOpen(false);
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: <Home />,
      active: loc.pathname === "/",
    },
    {
      path: "/events",
      label: "Events",
      icon: <Event />,
      active: loc.pathname.startsWith("/events"),
    },
    {
      path: "/questions",
      label: "Questions",
      icon: <QuestionAnswer />,
      active: loc.pathname.startsWith("/questions"),
    },
    {
      path: "/leaderboard",
      label: "Leaderboard",
      icon: <Leaderboard />,
      active: loc.pathname.startsWith("/leaderboard"),
    },
    {
      path: "/about",
      label: "About",
      icon: <Info />,
      active: loc.pathname.startsWith("/about"),
    },
  ];

  const getPageTitle = () => {
    if (loc.pathname === "/") return "Home";
    if (loc.pathname.startsWith("/events")) return "Events";
    if (loc.pathname.startsWith("/questions")) return "Questions";
    if (loc.pathname.startsWith("/leaderboard")) return "Leaderboard";
    if (loc.pathname.startsWith("/host")) return "Host Event";
    if (loc.pathname.startsWith("/join")) return "Join Event";
    return "AndEvent";
  };

  // Mobile Drawer Content - Red themed
  const mobileDrawer = (
    <Box
      sx={{
        width: 300,
        height: "100%",
        background: `linear-gradient(135deg, ${andEventColors.dark} 0%, ${andEventColors.primary} 100%)`,
        color: "white",
      }}
    >
      <Stack sx={{ height: "100%" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            p: 2,
            borderBottom: `1px solid ${alpha("#fff", 0.1)}`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              sx={{
                background: andEventColors.gradient,
                width: 36,
                height: 36,
              }}
            >
              <Celebration sx={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={900} sx={{ color: "white" }}>
                AndEvent
              </Typography>
              <Typography variant="caption" sx={{ color: alpha("#fff", 0.7) }}>
                Event Platform
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={() => setMobileMenuOpen(false)}
            sx={{
              color: "white",
              "&:hover": { bgcolor: alpha(andEventColors.accent, 0.2) },
            }}
          >
            <Close />
          </IconButton>
        </Stack>

        <List sx={{ flex: 1, p: 2 }}>
          {navItems.map((item) => (
            <ListItem
              key={item.path}
              onClick={() => go(item.path)}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: item.active
                  ? alpha(andEventColors.accent, 0.2)
                  : "transparent",
                color: "white",
                "&:hover": {
                  bgcolor: alpha(andEventColors.accent, 0.1),
                },
                cursor: "pointer",
              }}
            >
              <ListItemIcon
                sx={{
                  color: item.active ? andEventColors.accent : "white",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: item.active ? 700 : 500,
                }}
              />
              {item.active && (
                <Box
                  sx={{
                    width: 4,
                    height: 30,
                    bgcolor: andEventColors.accent,
                    borderRadius: 4,
                  }}
                />
              )}
            </ListItem>
          ))}

          <Divider sx={{ my: 2, borderColor: alpha("#fff", 0.1) }} />

          {/* Quick Actions */}
          <ListItem
            onClick={() => go("/host")}
            sx={{
              borderRadius: 2,
              mb: 1,
              bgcolor: alpha(andEventColors.accent, 0.1),
              "&:hover": { bgcolor: alpha(andEventColors.accent, 0.2) },
              cursor: "pointer",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: andEventColors.accent }}>
              <Whatshot />
            </ListItemIcon>
            <ListItemText
              primary="Host Event"
              primaryTypographyProps={{ fontWeight: 700 }}
            />
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
          </ListItem>

          <ListItem
            onClick={() => go("/help")}
            sx={{
              borderRadius: 2,
              mb: 1,
              "&:hover": { bgcolor: alpha(andEventColors.accent, 0.1) },
              cursor: "pointer",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "white" }}>
              <Help />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItem>

          <ListItem
            onClick={() => window.open("https://github.com", "_blank")}
            sx={{
              borderRadius: 2,
              mb: 1,
              "&:hover": { bgcolor: alpha(andEventColors.accent, 0.1) },
              cursor: "pointer",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "white" }}>
              <GitHub />
            </ListItemIcon>
            <ListItemText primary="GitHub" />
          </ListItem>
        </List>

        <Box sx={{ p: 2, borderTop: `1px solid ${alpha("#fff", 0.1)}` }}>
          <Stack spacing={1}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Login />}
              onClick={() => go("/login")}
              sx={{
                color: "white",
                borderColor: alpha("#fff", 0.3),
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
              onClick={() => go("/signup")}
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
          <Chip
            icon={<EmojiEvents sx={{ color: andEventColors.accent }} />}
            label="v1.0.0"
            variant="outlined"
            size="small"
            sx={{
              width: "100%",
              mt: 2,
              color: "white",
              borderColor: alpha("#fff", 0.2),
            }}
          />
        </Box>
      </Stack>
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
      <Toolbar sx={{ minHeight: 70 }}>
        {/* Logo and Brand - Updated for AndEvent */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ cursor: "pointer" }}
          onClick={() => go("/")}
        >
          <Avatar
            sx={{
              background: andEventColors.gradient,
              width: 44,
              height: 44,
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
            fontWeight={900}
            sx={{
              display: { xs: "none", sm: "block" },
              color: "white",
              letterSpacing: 1,
              textShadow: `0 2px 5px ${alpha(andEventColors.dark, 0.5)}`,
            }}
          >
            AndEvent
          </Typography>
        </Stack>

        {/* Mobile Menu Button */}
        {isMobile ? (
          <IconButton
            onClick={() => setMobileMenuOpen(true)}
            sx={{
              ml: "auto",
              color: "white",
              "&:hover": { bgcolor: alpha(andEventColors.accent, 0.2) },
            }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <>
            {/* Desktop Navigation */}
            <Stack direction="row" spacing={1} sx={{ ml: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => go(item.path)}
                  startIcon={item.icon}
                  sx={{
                    color: item.active
                      ? andEventColors.accent
                      : alpha("#fff", 0.9),
                    fontWeight: item.active ? 700 : 500,
                    position: "relative",
                    "&::after": item.active
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
                    "&:hover": {
                      bgcolor: alpha(andEventColors.accent, 0.1),
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            {/* Right Side Actions */}
            <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
              {/* Quick Host Button */}
              <Button
                variant="contained"
                startIcon={<Whatshot />}
                onClick={() => go("/host")}
                sx={{
                  bgcolor: andEventColors.accent,
                  color: "white",
                  fontWeight: 700,
                  px: 2,
                  "&:hover": {
                    bgcolor: andEventColors.primary,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Host Event
              </Button>

              {/* Notifications */}
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
                  <Notifications />
                </IconButton>
              </Badge>

              {/* Current Page Indicator */}
              <Chip
                label={getPageTitle()}
                size="small"
                sx={{
                  display: { xs: "none", lg: "flex" },
                  bgcolor: alpha("#fff", 0.1),
                  color: "white",
                  fontWeight: 600,
                  border: `1px solid ${alpha(andEventColors.accent, 0.3)}`,
                }}
              />

              {/* Profile Menu */}
              <Button
                onClick={handleMenuClick}
                endIcon={<ArrowDropDown />}
                sx={{
                  borderRadius: 2,
                  px: 1,
                  color: "white",
                  "&:hover": {
                    bgcolor: alpha(andEventColors.accent, 0.1),
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    sx={{
                      "& .MuiBadge-dot": {
                        bgcolor: "#4CAF50",
                        boxShadow: `0 0 0 2px ${andEventColors.primary}`,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: andEventColors.accent,
                      }}
                    >
                      U
                    </Avatar>
                  </Badge>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ display: { xs: "none", lg: "block" } }}
                  >
                    Profile
                  </Typography>
                </Stack>
              </Button>
            </Stack>
          </>
        )}

        {/* Profile Menu Dropdown - Red themed */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 220,
              borderRadius: 2,
              background: alpha(andEventColors.dark, 0.95),
              backdropFilter: "blur(10px)",
              border: `1px solid ${alpha(andEventColors.accent, 0.2)}`,
              color: "white",
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${alpha("#fff", 0.1)}` }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{ bgcolor: andEventColors.accent, width: 40, height: 40 }}
              >
                U
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ color: "white" }}
                >
                  User Name
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: alpha("#fff", 0.6) }}
                >
                  user@example.com
                </Typography>
              </Box>
            </Stack>
          </Box>

          <MenuItem
            onClick={handleMenuClose}
            sx={{
              color: "white",
              "&:hover": { bgcolor: alpha(andEventColors.accent, 0.1) },
            }}
          >
            <ListItemIcon>
              <Dashboard sx={{ color: andEventColors.accent, fontSize: 20 }} />
            </ListItemIcon>
            <Typography variant="body2">Dashboard</Typography>
          </MenuItem>

          <MenuItem
            onClick={handleMenuClose}
            sx={{
              color: "white",
              "&:hover": { bgcolor: alpha(andEventColors.accent, 0.1) },
            }}
          >
            <ListItemIcon>
              <Settings sx={{ color: andEventColors.accent, fontSize: 20 }} />
            </ListItemIcon>
            <Typography variant="body2">Settings</Typography>
          </MenuItem>

          <Divider sx={{ borderColor: alpha("#fff", 0.1) }} />

          <MenuItem
            onClick={handleMenuClose}
            sx={{
              color: "white",
              "&:hover": { bgcolor: alpha(andEventColors.accent, 0.1) },
            }}
          >
            <ListItemIcon>
              <Help sx={{ color: andEventColors.accent, fontSize: 20 }} />
            </ListItemIcon>
            <Typography variant="body2">Help</Typography>
          </MenuItem>

          <MenuItem
            onClick={handleMenuClose}
            sx={{
              color: andEventColors.accent,
              "&:hover": { bgcolor: alpha(andEventColors.accent, 0.1) },
            }}
          >
            <ListItemIcon>
              <Login sx={{ color: andEventColors.accent, fontSize: 20 }} />
            </ListItemIcon>
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          }}
        >
          {mobileDrawer}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
