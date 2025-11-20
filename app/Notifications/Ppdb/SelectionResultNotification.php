<?php

namespace App\Notifications\Ppdb;

use App\Models\Ppdb\Registration;
use App\Models\Ppdb\Selection;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SelectionResultNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Registration $registration,
        public Selection $selection
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $registration = $this->registration;
        $selection = $this->selection;
        $checkUrl = url('/ppdb/check');

        $mail = (new MailMessage)
            ->greeting('Halo ' . $registration->name . '!');

        if ($selection->status === 'passed') {
            $mail->subject('SELAMAT! Anda Diterima - ' . $registration->registration_number)
                ->line('Selamat! Anda dinyatakan **LULUS** seleksi PPDB.')
                ->line('')
                ->line('**Detail Hasil Seleksi:**')
                ->line('Nomor Pendaftaran: ' . $registration->registration_number)
                ->line('Jalur: ' . $registration->path->name)
                ->line('Peringkat: ' . $selection->rank)
                ->line('Nilai Akhir: ' . number_format($selection->final_score, 2))
                ->line('')
                ->line('**Langkah Selanjutnya:**')
                ->line('1. Lakukan daftar ulang sesuai jadwal')
                ->line('2. Siapkan dokumen asli untuk verifikasi')
                ->line('3. Lakukan pembayaran jika diperlukan')
                ->action('Lihat Detail', $checkUrl);
        } elseif ($selection->status === 'reserve') {
            $mail->subject('Hasil Seleksi - Cadangan - ' . $registration->registration_number)
                ->line('Anda dinyatakan sebagai **CADANGAN** dalam seleksi PPDB.')
                ->line('')
                ->line('**Detail Hasil Seleksi:**')
                ->line('Nomor Pendaftaran: ' . $registration->registration_number)
                ->line('Jalur: ' . $registration->path->name)
                ->line('Peringkat: ' . $selection->rank)
                ->line('Nilai Akhir: ' . number_format($selection->final_score, 2))
                ->line('')
                ->line('Anda akan dihubungi jika ada kuota yang tersedia.')
                ->action('Lihat Detail', $checkUrl);
        } else {
            $mail->subject('Hasil Seleksi PPDB - ' . $registration->registration_number)
                ->line('Mohon maaf, Anda dinyatakan **TIDAK LULUS** dalam seleksi PPDB.')
                ->line('')
                ->line('**Detail Hasil Seleksi:**')
                ->line('Nomor Pendaftaran: ' . $registration->registration_number)
                ->line('Jalur: ' . $registration->path->name)
                ->line('Nilai Akhir: ' . number_format($selection->final_score, 2))
                ->line('')
                ->line('Jangan berkecil hati, tetap semangat untuk kesempatan berikutnya!')
                ->action('Lihat Detail', $checkUrl);
        }

        return $mail->salutation('Salam, Tim PPDB ' . config('app.name'));
    }

    public function toArray(object $notifiable): array
    {
        $statusLabels = [
            'passed' => 'Lulus',
            'failed' => 'Tidak Lulus',
            'reserve' => 'Cadangan',
        ];

        return [
            'title' => 'Hasil Seleksi PPDB',
            'message' => 'Status: ' . ($statusLabels[$this->selection->status] ?? $this->selection->status),
            'registration_id' => $this->registration->id,
            'selection_id' => $this->selection->id,
            'status' => $this->selection->status,
        ];
    }
}
