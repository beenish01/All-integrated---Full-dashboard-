import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Settings,
  ALargeSmall,
  Eye,
  ArrowLeftRight,
  Mail,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function SettingsDialog() {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [fontFamily, setFontFamily] = useState("inter");
  const [letterSpacing, setLetterSpacing] = useState("normal");

  const [firstName, setFirstName] = useState("Raine");
  const [lastName, setLastName] = useState("R");
  const [email, setEmail] = useState("rainy.wadhwani42@gmail.com");
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("fontSize");
    const savedHighContrast = localStorage.getItem("highContrast");
    const savedFontFamily = localStorage.getItem("fontFamily");
    const savedLetterSpacing = localStorage.getItem("letterSpacing");
    if (savedFontSize) handleFontSizeChange(Number(savedFontSize));
    if (savedHighContrast)
      handleHighContrastChange(savedHighContrast === "true");
    if (savedFontFamily) handleFontFamilyChange(savedFontFamily);
    if (savedLetterSpacing) handleLetterSpacingChange(savedLetterSpacing);

    const savedFirstName = localStorage.getItem("firstName");
    const savedLastName = localStorage.getItem("lastName");
    const savedEmail = localStorage.getItem("email");
    const savedEmailNotifications = localStorage.getItem("emailNotifications");
    if (savedFirstName) setFirstName(savedFirstName);
    if (savedLastName) setLastName(savedLastName);
    if (savedEmail) setEmail(savedEmail);
    if (savedEmailNotifications)
      setEmailNotifications(savedEmailNotifications === "true");
  }, []);

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
    localStorage.setItem("fontSize", String(newSize));
  };

  const handleHighContrastChange = (enabled: boolean) => {
    setHighContrast(enabled);
    if (enabled) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    localStorage.setItem("highContrast", String(enabled));
  };

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    const fontMap: Record<string, string> = {
      inter: "'Inter', sans-serif",
      arial: "'Arial', sans-serif",
      comic: "'Comic Sans MS', sans-serif",
      opendyslexic: "'OpenDyslexic', sans-serif",
    };
    document.body.style.fontFamily = fontMap[value] || fontMap["inter"];
    localStorage.setItem("fontFamily", value);
  };

  const handleLetterSpacingChange = (value: string) => {
    setLetterSpacing(value);
    document.body.style.letterSpacing = value;
    localStorage.setItem("letterSpacing", value);
  };

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    localStorage.setItem("firstName", value);
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    localStorage.setItem("lastName", value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    localStorage.setItem("email", value);
  };

  const handleEmailNotificationsChange = (enabled: boolean) => {
    setEmailNotifications(enabled);
    localStorage.setItem("emailNotifications", String(enabled));
  };

  const getUserInitials = () => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center w-full py-3 px-4 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Settings className="mr-3 text-gray-500" size={20} />
          <span className="text-sm">Settings</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="account" className="py-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 bg-green-600">
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {firstName} {lastName}
                </p>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => handleFirstNameChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => handleLastNameChange(e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <Label className="text-sm font-medium">
                    Email Notifications
                  </Label>
                </div>
                <p className="text-sm text-gray-500">
                  Receive email notifications from us
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={handleEmailNotificationsChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ALargeSmall className="h-4 w-4" />
                  <Label className="text-sm font-medium">Font Size</Label>
                </div>
                <p className="text-sm text-gray-500">
                  Adjust text size for better readability
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFontSizeChange(Math.max(12, fontSize - 2))}
                  className="border px-2 rounded"
                >
                  -
                </button>
                <span className="w-8 text-center">{fontSize}</span>
                <button
                  onClick={() => handleFontSizeChange(Math.min(24, fontSize + 2))}
                  className="border px-2 rounded"
                >
                  +
                </button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ALargeSmall className="h-4 w-4" />
                  <Label className="text-sm font-medium">Font Type</Label>
                </div>
                <p className="text-sm text-gray-500">
                  Choose a font that works best for you
                </p>
              </div>
              <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="arial">Arial</SelectItem>
                  <SelectItem value="comic">Comic Sans MS</SelectItem>
                  <SelectItem value="opendyslexic">OpenDyslexic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="h-4 w-4" />
                  <Label className="text-sm font-medium">Text Spacing</Label>
                </div>
                <p className="text-sm text-gray-500">
                  Adjust spacing between letters for better readability
                </p>
              </div>
              <Select
                value={letterSpacing}
                onValueChange={handleLetterSpacingChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select spacing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="0.05em">Slightly Increased</SelectItem>
                  <SelectItem value="0.1em">Increased</SelectItem>
                  <SelectItem value="0.15em">Maximum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <Label className="text-sm font-medium">
                    High Contrast Mode
                  </Label>
                </div>
                <p className="text-sm text-gray-500">
                  Enhance visual contrast for better visibility
                </p>
              </div>
              <Switch
                checked={highContrast}
                onCheckedChange={handleHighContrastChange}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}