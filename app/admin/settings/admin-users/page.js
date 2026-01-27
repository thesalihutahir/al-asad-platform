"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AccessRestricted from '@/components/AccessRestricted';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Shield, UserCheck, XCircle, CheckCircle } from 'lucide-react';
import { logAudit } from '@/lib/audit';

export default function AdminUsersPage() {
    const { user } = useAuth();
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        if (user?.role === 'super_admin') {
            const q = query(collection(db, 'users'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setAdmins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });
            return () => unsubscribe();
        }
    }, [user]);

    if (user?.role !== 'super_admin') {
        return <AccessRestricted role={user?.role} message="Only Super Admins can manage system users." />;
    }

    const handleRoleChange = async (targetId, newRole) => {
        const targetAdmin = admins.find(a => a.id === targetId);
        
        // PROTECT SUPER ADMIN (Hardcoded Safety)
        if (targetAdmin.email === 'realdahirusalihu@gmail.com') {
            return alert("Cannot modify the primary Super Admin.");
        }

        if (!confirm(`Change role for ${targetAdmin.email} to ${newRole}?`)) return;

        await updateDoc(doc(db, 'users', targetId), { role: newRole });
        await logAudit({
            action: 'ADMIN_ROLE_CHANGED',
            entityType: 'admin',
            entityId: targetId,
            summary: `Changed ${targetAdmin.email} role to ${newRole}`,
            actor: user
        });
    };

    const toggleStatus = async (targetId, currentStatus) => {
        const targetAdmin = admins.find(a => a.id === targetId);
        
        if (targetAdmin.email === 'realdahirusalihu@gmail.com') {
            return alert("Cannot deactivate the primary Super Admin.");
        }

        await updateDoc(doc(db, 'users', targetId), { active: !currentStatus });
        await logAudit({
            action: 'ADMIN_STATUS_CHANGED',
            entityType: 'admin',
            entityId: targetId,
            summary: `${!currentStatus ? 'Activated' : 'Deactivated'} admin ${targetAdmin.email}`,
            actor: user
        });
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 p-4 sm:p-6 lg:p-8 font-lato">
            <h1 className="text-3xl font-agency font-bold text-brand-brown-dark mb-2">Admin User Management</h1>
            <p className="text-gray-500 text-sm mb-8">Control access levels and system roles.</p>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {admins.map(admin => (
                            <tr key={admin.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-800">{admin.displayName || "Unknown"}</div>
                                    <div className="text-xs text-gray-500">{admin.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={admin.role} 
                                        onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                                        disabled={admin.email === 'realdahirusalihu@gmail.com'}
                                        className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                                    >
                                        <option value="super_admin">Super Admin</option>
                                        <option value="finance_admin">Finance Admin</option>
                                        <option value="content_admin">Content Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    {admin.active !== false ? (
                                        <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded"><CheckCircle className="w-3 h-3" /> Active</span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded"><XCircle className="w-3 h-3" /> Inactive</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => toggleStatus(admin.id, admin.active !== false)}
                                        disabled={admin.email === 'realdahirusalihu@gmail.com'}
                                        className={`text-xs font-bold underline ${admin.active !== false ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}
                                    >
                                        {admin.active !== false ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
