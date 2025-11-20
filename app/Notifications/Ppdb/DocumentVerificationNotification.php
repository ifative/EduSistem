<?php

namespace App\Notifications\Ppdb;

use App\Models\Ppdb\Registration;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DocumentVerificationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Registration $registration,
        public string $status,
        public ?string $notes = null
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $registration = $this->registration;
        $checkUrl = url('/ppdb/check');

        $mail = (new MailMessage)
            ->greeting('Halo ' . $registration->name . '!');

        if ($this->status === 'verified') {
            $mail->subject('Dokumen Diverifikasi - ' . $registration->registration_number)
                ->line('Selamat! Semua dokumen pendaftaran Anda telah diverifikasi dan disetujui.')
                ->line('Nomor Pendaftaran: **' . $registration->registration_number . '**')
                ->line('')
                ->line('Pendaftaran Anda telah masuk dalam tahap seleksi. Silakan tunggu pengumuman hasil seleksi.')
                ->action('Cek Status Pendaftaran', $checkUrl);
        } elseif ($this->status === 'revision') {
            $mail->subject('Dokumen Perlu Diperbaiki - ' . $registration->registration_number)
                ->line('Beberapa dokumen pendaftaran Anda perlu diperbaiki.')
                ->line('Nomor Pendaftaran: **' . $registration->registration_number . '**')
                ->line('');

            if ($this->notes) {
                $mail->line('**Catatan:**')
                    ->line($this->notes)
                    ->line('');
            }

            $mail->line('Silakan login dan perbaiki dokumen yang ditolak, kemudian upload ulang.')
                ->action('Perbaiki Dokumen', $checkUrl);
        }

        return $mail->salutation('Salam, Tim PPDB ' . config('app.name'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->status === 'verified' ? 'Dokumen Diverifikasi' : 'Dokumen Perlu Diperbaiki',
            'message' => 'Status dokumen: ' . $this->status,
            'registration_id' => $this->registration->id,
            'notes' => $this->notes,
        ];
    }
}
