import { ReactNode } from 'react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

interface Props {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary';
    processing?: boolean;
}

export default function ConfirmModal({
    show,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    variant = 'danger',
    processing = false,
}: Props) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6 bg-surface">
                <h2 className="text-lg font-medium text-primary mb-4">
                    {title}
                </h2>

                <div className="mt-2 text-sm text-secondary">
                    {description}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        {cancelText}
                    </SecondaryButton>

                    {variant === 'danger' ? (
                        <DangerButton onClick={onConfirm} disabled={processing} className="ms-3">
                            {confirmText}
                        </DangerButton>
                    ) : (
                        <PrimaryButton onClick={onConfirm} disabled={processing} className="ms-3">
                            {confirmText}
                        </PrimaryButton>
                    )}
                </div>
            </div>
        </Modal>
    );
}
