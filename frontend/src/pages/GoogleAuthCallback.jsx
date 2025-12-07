import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import API from '../api/client';
import './Login.scss';

const GoogleAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [status, setStatus] = useState('processing'); // processing, success, error

    useEffect(() => {
        const handleGoogleCallback = async () => {
            try {
                const token = searchParams.get('token');
                const error = searchParams.get('error');

                if (error) {
                    setStatus('error');
                    toast.error('Google authentication failed. Please try again.');
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                }

                if (!token) {
                    setStatus('error');
                    toast.error('No authentication token received.');
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                }

                // Fetch user data with the token
                const { data } = await API.get('/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Login user with token and user data
                login(token, data.user);
                setStatus('success');
                toast.success('Successfully logged in with Google!');

                // Redirect to home page after a brief delay
                setTimeout(() => navigate('/'), 1500);
            } catch (error) {
                console.error('Google auth callback error:', error);
                setStatus('error');
                toast.error('Failed to complete Google authentication.');
                setTimeout(() => navigate('/login'), 2000);
            }
        };

        handleGoogleCallback();
    }, [searchParams, navigate, login]);

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <motion.div
                    className="auth-form-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        maxWidth: '500px',
                        margin: '100px auto',
                        textAlign: 'center',
                        padding: '40px'
                    }}
                >
                    {status === 'processing' && (
                        <>
                            <motion.div
                                className="spinner"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    border: '4px solid #f3f3f3',
                                    borderTop: '4px solid #3498db',
                                    borderRadius: '50%',
                                    margin: '0 auto 20px',
                                }}
                            />
                            <h2 style={{ marginBottom: '10px' }}>Completing Sign In...</h2>
                            <p style={{ color: '#666' }}>Please wait while we verify your Google account.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    backgroundColor: '#22c55e',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    fontSize: '30px',
                                    color: 'white',
                                }}
                            >
                                ✓
                            </motion.div>
                            <h2 style={{ marginBottom: '10px', color: '#22c55e' }}>Success!</h2>
                            <p style={{ color: '#666' }}>Redirecting you to the homepage...</p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ef4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    fontSize: '30px',
                                    color: 'white',
                                }}
                            >
                                ✕
                            </motion.div>
                            <h2 style={{ marginBottom: '10px', color: '#ef4444' }}>Authentication Failed</h2>
                            <p style={{ color: '#666' }}>Redirecting you back to login...</p>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default GoogleAuthCallback;
