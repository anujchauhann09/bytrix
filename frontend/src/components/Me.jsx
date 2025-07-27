'use client';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { UploadNavbar } from '@/components/UploadNavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield, Bell, Palette, LogOut, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';


export function Me() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    is_subscribed: false,
    whatsapp: false,
    dnd: false
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await api.getProfile();
      const data = response.data;
            
      const profileDataToSet = {
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
        is_subscribed: data.is_subscribed || false,
        whatsapp: Boolean(data.whatsapp),
        dnd: Boolean(data.dnd) 
      };
            
      setProfileData(profileDataToSet);
      
      setFormData({
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdatingProfile(true);
      
      const response = await api.updateProfile(formData);
      
      toast.success('Profile updated successfully!');
      setProfileData(prev => ({ ...prev, ...formData }));
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setIsChangingPassword(true);
      
      await api.updateProfile(passwordData);
      
      toast.success('Password changed successfully!');
      setPasswordData({ current_password: '', new_password: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleTogglePreference = async (field, value) => {
    try {      
      await api.updateProfile({ [field]: value });
      
      setProfileData(prev => {
        const updated = { ...prev, [field]: value };
        return updated;
      });
      
      toast.success(`${field === 'whatsapp' ? 'WhatsApp' : field.toUpperCase()} ${value ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(error.message || `Failed to update ${field === 'whatsapp' ? 'WhatsApp' : field.toUpperCase()} setting`);
    }
  };

  
  const handleDeleteAccount = async () => {
    const confirmed = await new Promise((resolve) => {
      toast(
        (t) => (
          <div className="p-4">
            <p className="font-medium text-gray-900 mb-3">Are you sure you want to delete your account?</p>
            <p className="text-sm text-gray-600 mb-4">This action cannot be undone and will permanently delete all your data.</p>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
              >
                Yes, delete
              </button>
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        { 
          duration: 10000,
          style: {
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '0',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          }
        }
      );
    });
  
    if (!confirmed) return;
  
    try {
        setIsDeletingAccount(true);
        const response = await api.deleteAccount();
    
        if (response && response.status) {
          toast.success('Account deleted successfully!');
          Cookies.remove('userEmail');
          Cookies.remove('access');
          Cookies.remove('refresh');
    
          setTimeout(() => router.push('/login'), 1500);
        } else {
          throw new Error('Failed to delete account');
        }
      } catch (error) {
        toast.error(error.message || 'Something went wrong while deleting your account.');
      } finally {
        setIsDeletingAccount(false);
      }    
  };
  
  return (
    <div className="min-h-screen bg-background">
      <UploadNavbar currentPage="Account Settings" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and settings</p>
          </div>



          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading profile data...</div>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Your basic account information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                      <input
                        id="email"
                        value={profileData.email}
                        disabled
                        className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium">Username</label>
                      <input
                        id="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                      <input
                        id="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={handleUpdateProfile}
                      disabled={isUpdatingProfile}
                    >
                      {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Security
                    </CardTitle>
                    <CardDescription>
                      Manage your account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="current-password" className="text-sm font-medium">Current Password</label>
                      <input
                        id="current-password"
                        type="password"
                        placeholder="Enter current password"
                        value={passwordData.current_password}
                        onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                      <input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                        value={passwordData.new_password}
                        onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? 'Changing...' : 'Change Password'}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Preferences
                    </CardTitle>
                    <CardDescription>
                      Customize your experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-base font-medium">WhatsApp Notifications</label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via WhatsApp
                        </p>
                      </div>
                      <button
                        onClick={() => handleTogglePreference('whatsapp', !profileData.whatsapp)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          profileData.whatsapp ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            profileData.whatsapp ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="h-[1px] bg-border"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-base font-medium">Do Not Disturb (DND)</label>
                        <p className="text-sm text-muted-foreground">
                          Pause all notifications temporarily
                        </p>
                      </div>
                      <button
                        onClick={() => handleTogglePreference('dnd', !profileData.dnd)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          profileData.dnd ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            profileData.dnd ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Appearance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Appearance
                    </CardTitle>
                    <CardDescription>
                      Customize the look and feel
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-base font-medium">Theme</label>
                        <p className="text-sm text-muted-foreground">
                          Choose your preferred theme
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={toggleTheme}
                      >
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                      </Button>
                    </div>
                    <div className="h-[1px] bg-border"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-base font-medium">Language</label>
                        <p className="text-sm text-muted-foreground">
                          Select your preferred language
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        English
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-8 border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-base font-medium text-destructive">Delete Account</label>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
                    </Button>
                  </div>
                  <div className="h-[1px] bg-border my-4"></div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-base font-medium">Logout</label>
                      <p className="text-sm text-muted-foreground">
                        Sign out of your account
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="text-destructive hover:text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {isLoading ? 'Logging out...' : 'Logout'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 