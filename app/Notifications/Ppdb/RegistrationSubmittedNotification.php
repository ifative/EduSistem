<?php

namespace App\Notifications\Ppdb;

use App\Models\Ppdb\Registration;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RegistrationSubmittedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Registration $registration
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $registration = $this->registration;
        $checkUrl = url('/ppdb/check');

        return (new MailMessage)
            ->subject('Pendaftaran PPDB Berhasil - ' . $registration->registration_number)
            ->greeting('Halo ' . $registration->name . '!')
            ->line('Terima kasih telah mendaftar di ' . config('app.name') . '.')
            ->line('Nomor pendaftaran Anda: **' . $registration->registration_number . '**')
            ->line('Periode: ' . $registration->period->name)
            ->line('Jalur: ' . $registration->path->name)
            ->line('')
            ->line('**Langkah Selanjutnya:**')
            ->line('1. Simpan nomor pendaftaran Anda')
            ->line('2. Lengkapi dokumen yang diperlukan')
            ->line('3. Pantau status pendaftaran Anda')
            ->action('Cek Status Pendaftaran', $checkUrl)
            ->line('')
            ->line('Jika ada pertanyaan, silakan hubungi panitia PPDB.')
            ->salutation('Salam, Tim PPDB ' . config('app.name'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Pendaftaran PPDB Berhasil',
            'message' => 'Nomor pendaftaran: ' . $this->registration->registration_number,
            'registration_id' => $this->registration->id,
        ];
    }
}
