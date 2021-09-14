import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IEventDispatcher, Nitro } from '@nitrots/nitro-renderer';
import * as $ from "jquery";
import { ConversionTrackingWidget } from '../ConversionTrackingWidget';
import { RoomWidgetChatInputContentUpdateEvent } from '../events/RoomWidgetChatInputContentUpdateEvent';
import { RoomWidgetFloodControlEvent } from '../events/RoomWidgetFloodControlEvent';
import { RoomWidgetRoomObjectUpdateEvent } from '../events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetUpdateInfostandUserEvent } from '../events/RoomWidgetUpdateInfostandUserEvent';
import { ChatInputWidgetHandler } from '../handlers/ChatInputWidgetHandler';
import { RoomWidgetChatMessage } from '../messages/RoomWidgetChatMessage';
import { RoomWidgetChatTypingMessage } from '../messages/RoomWidgetChatTypingMessage';

@Component({
    selector: 'nitro-room-chatinput-component',
    template: `

    
    <div class="anan">

        <div class="bottomBar-emoji-secim-box" [ngClass]="{'d-none': ela === false}">
            <div class="esb-header">Hotel Emoji</div>
            <div class="emojiBottom"></div>
            <div class="emoji-list">
                <div class="emoji-kategori-box">😘 ➤</div>
                <div class="emojibox" none="Sırıtan Yüz" (click)="bottomBarEmoji('😀')">😀</div>
                <div class="emojibox" none="Gülen Gözlerle Parlayan Yüz" (click)="bottomBarEmoji('😁')">😁</div>
                <div class="emojibox" none="Sevinç Gözyaşlarıyla Yüzleş" (click)="bottomBarEmoji('😂')">😂</div>
                <div class="emojibox" none="Yuvarlanıp Gülmek" (click)="bottomBarEmoji('🤣')">🤣</div>
                <div class="emojibox" none="İri Gözlü Sırıtan Yüz" (click)="bottomBarEmoji('😃')">😃</div>
                <div class="emojibox" none="Gülen Gözlerle Sırıtan Yüz" (click)="bottomBarEmoji('😄')">😄</div>
                <div class="emojibox" none="Terle Sırıtan Yüz" (click)="bottomBarEmoji('😅')">😅</div>
                <div class="emojibox" none="Şaşı Şaşı Yüz" (click)="bottomBarEmoji('😆')">😆</div>
                <div class="emojibox" none="Göz Kırpan Yüz" (click)="bottomBarEmoji('😉')">😉</div>
                <div class="emojibox" none="Gülen Gözlerle Gülen Yüz" (click)="bottomBarEmoji('😊')">😊</div>
                <div class="emojibox" none="Şahane Yemek Gören Yüz" (click)="bottomBarEmoji('😋')">😋</div>
                <div class="emojibox" none="Güneş Gözlüğü İle Gülen Yüz" (click)="bottomBarEmoji('😎')">😎</div>
                <div class="emojibox" none="Aşık Olmuş Yüz" (click)="bottomBarEmoji('😍')">😍</div>
                <div class="emojibox" none="Öpücük Gönderen Yüz" (click)="bottomBarEmoji('😘')">😘</div>
                <div class="emojibox" none="Öpüşen Yüz" (click)="bottomBarEmoji('😗')">😗</div>
                <div class="emojibox" none="Gülen Gözlerle Öpüşme Yüzü" (click)="bottomBarEmoji('😙')">😙</div>
                <div class="emojibox" none="Kapalı Gözlerle Öpüşme Yüzü" (click)="bottomBarEmoji('😚')">😚</div>
                <div class="emojibox" none="Biraz Gülen Yüz" (click)="bottomBarEmoji('🙂')">🙂</div>
                <div class="emojibox" none="Sarılan Yüz" (click)="bottomBarEmoji('🤗')">🤗</div>
                <div class="emojibox" none="Parıldayan Yüz" (click)="bottomBarEmoji('🤩')">🤩</div>
                <div class="emojibox" none="Düşünen Yüz" (click)="bottomBarEmoji('🤔')">🤔</div>
                <div class="emojibox" none="Kaş Kaldırmış Yüz" (click)="bottomBarEmoji('🤨')">🤨</div>
                <div class="emojibox" none="Nötr Yüz" (click)="bottomBarEmoji('😐')">😐</div>
                <div class="emojibox" none="İfadesiz Yüz" (click)="bottomBarEmoji('😑')">😑</div>
                <div class="emojibox" none="Ağızsız Yüz" (click)="bottomBarEmoji('😶')">😶</div>
                <div class="emojibox" none="Yuvarlanan Gözlerle Yüz" (click)="bottomBarEmoji('🙄')">🙄</div>
                <div class="emojibox" none="Sırıtan Yüz" (click)="bottomBarEmoji('😏')">😏</div>
                <div class="emojibox" none="Azimli Yüz" (click)="bottomBarEmoji('😣')">😣</div>
                <div class="emojibox" none="Üzgün ama Rahatlamış Yüz" (click)="bottomBarEmoji('😥')">😥</div>
                <div class="emojibox" none="Ağzı Açık Yüz" (click)="bottomBarEmoji('😮')">😮</div>
                <div class="emojibox" none="Konuşmayan Yüz" (click)="bottomBarEmoji('🤐')">🤐</div>
                <div class="emojibox" none="Şaşırmış Yüz" (click)="bottomBarEmoji('😯')">😯</div>
                <div class="emojibox" none="Uykulu Yüz" (click)="bottomBarEmoji('😪')">😪</div>
                <div class="emojibox" none="Yorgun Yüz" (click)="bottomBarEmoji('😫')">😫</div>
                <div class="emojibox" none="Uyuyan Yüz" (click)="bottomBarEmoji('😴')">😴</div>
                <div class="emojibox" none="Rahatlamış Yüz" (click)="bottomBarEmoji('😌')">😌</div>
                <div class="emojibox" none="Dil Çıkaran Yüz" (click)="bottomBarEmoji('😛')">😛</div>
                <div class="emojibox" none="Dil Çıkarıp Göz Kırpan Yüz" (click)="bottomBarEmoji('😜')">😜</div>
                <div class="emojibox" none="Dil Çıkarıp Şaşı Bakan Yüz" (click)="bottomBarEmoji('😝')">😝</div>
                <div class="emojibox" none="Salya Akan Yüz" (click)="bottomBarEmoji('🤤')">🤤</div>
                <div class="emojibox" none="Eğlenmeyen Yüz" (click)="bottomBarEmoji('😒')">😒</div>
                <div class="emojibox" none="Terli Seksi Yüz" (click)="bottomBarEmoji('😓')">😓</div>
                <div class="emojibox" none="Dalgın Yüz" (click)="bottomBarEmoji('😔')">😔</div>
                <div class="emojibox" none="Şaşkın Yüz" (click)="bottomBarEmoji('😕')">😕</div>
                <div class="emojibox" none="Baş Aşağı Yüz" (click)="bottomBarEmoji('🙃')">🙃</div>
                <div class="emojibox" none="Paragöz Yüz" (click)="bottomBarEmoji('🤑')">🤑</div>
                <div class="emojibox" none="Şaşkın Yüz" (click)="bottomBarEmoji('😲')">😲</div>
                <div class="emojibox" none="Hafifce Asık Surat" (click)="bottomBarEmoji('🙁')">🙁</div>
                <div class="emojibox" none="Şaşkın Yüz" (click)="bottomBarEmoji('😖')">😖</div>
                <div class="emojibox" none="Hayal Kırıklığına Uğramış Yüz" (click)="bottomBarEmoji('😞')">😞</div>
                <div class="emojibox" none="Endişeli Yüz" (click)="bottomBarEmoji('😟')">😟</div>
                <div class="emojibox" none="Kızgın Yüz" (click)="bottomBarEmoji('😤')">😤</div>
                <div class="emojibox" none="Ağlayan Yüz" (click)="bottomBarEmoji('😢')">😢</div>
                <div class="emojibox" none="Hüngür Hüngür Ağlayan Yüz" (click)="bottomBarEmoji('😭')">😭</div>
                <div class="emojibox" none="Ağzı Açık Kalmış Yüz" (click)="bottomBarEmoji('😦')">😦</div>
                <div class="emojibox" none="Kederli Yüz" (click)="bottomBarEmoji('😧')">😧</div>
                <div class="emojibox" none="Korkunç Yüz" (click)="bottomBarEmoji('😨')">😨</div>
                <div class="emojibox" none="Yorgun Yüz" (click)="bottomBarEmoji('😩')">😩</div>
                <div class="emojibox" none="Patlayan Kafa" (click)="bottomBarEmoji('🤯')">🤯</div>
                <div class="emojibox" none="Diş Gösteren Yüz" (click)="bottomBarEmoji('😬')">😬</div>
                <div class="emojibox" none="Terli ve Endişeli Yüz" (click)="bottomBarEmoji('😰')">😰</div>
                <div class="emojibox" none="Korkudan Çığlık Atan Yüz" (click)="bottomBarEmoji('😱')">😱</div>
                <div class="emojibox" none="Kızarmış Surat" (click)="bottomBarEmoji('😳')">😳</div>
                <div class="emojibox" none="Eğlenceli Yüz" (click)="bottomBarEmoji('🤪')">🤪</div>
                <div class="emojibox" none="Başı Dönen Yüz" (click)="bottomBarEmoji('😵')">😵</div>
                <div class="emojibox" none="Surat Asan Yüz" (click)="bottomBarEmoji('😡')">😡</div>
                <div class="emojibox" none="Kızgın Surat" (click)="bottomBarEmoji('😠')">😠</div>
                <div class="emojibox" none="Argo Kullanan Yüz" (click)="bottomBarEmoji('🤬')">🤬</div>
                <div class="emojibox" none="Maske Takan Yüz" (click)="bottomBarEmoji('😷')">😷</div>
                <div class="emojibox" none="Termometreli Yüz" (click)="bottomBarEmoji('🤒')">🤒</div>
                <div class="emojibox" none="Baş Bandajlı Yüz" (click)="bottomBarEmoji('🤕')">🤕</div>
                <div class="emojibox" none="Miğdesi Bulanan Yüz" (click)="bottomBarEmoji('🤢')">🤢</div>
                <div class="emojibox" none="Kusan Yüz" (click)="bottomBarEmoji('🤮')">🤮</div>
                <div class="emojibox" none="Hapşıran Yüz" (click)="bottomBarEmoji('🤧')">🤧</div>
                <div class="emojibox" none="Melek Yüz" (click)="bottomBarEmoji('😇')">😇</div>
                <div class="emojibox" none="Kovboy Şapkalı Yüz" (click)="bottomBarEmoji('🤠')">🤠</div>
                <div class="emojibox" none="Palyaço Yüzü" (click)="bottomBarEmoji('🤡')">🤡</div>
                <div class="emojibox" none="Yalancı Yüz" (click)="bottomBarEmoji('🤥')">🤥</div>
                <div class="emojibox" none="Sus İşareti Yapan Yüz" (click)="bottomBarEmoji('🤫')">🤫</div>
                <div class="emojibox" none="Gülen Yüz" (click)="bottomBarEmoji('🤭')">🤭</div>
                <div class="emojibox" none="Tek Gözlüklü Yüz" (click)="bottomBarEmoji('🧐')">🧐</div>
                <div class="emojibox" none="İnek Yüz" (click)="bottomBarEmoji('🤓')">🤓</div>
                <div class="emojibox" none="Boynuzlu Kırmızı Şeytan" (click)="bottomBarEmoji('😈')">😈</div>
                <div class="emojibox" none="Boynuzlu Kırmızı Şeytan Yüzü" (click)="bottomBarEmoji('👿')">👿</div>
                <div class="emojibox" none="Canavar" (click)="bottomBarEmoji('👹')">👹</div>
                <div class="emojibox" none="Goblin" (click)="bottomBarEmoji('👺')">👺</div>
                <div class="emojibox" none="Kafatası" (click)="bottomBarEmoji('💀')">💀</div>
                <div class="emojibox" none="Hayalet" (click)="bottomBarEmoji('👻')">👻</div>
                <div class="emojibox" none="Uzaylı" (click)="bottomBarEmoji('👽')">👽</div>
                <div class="emojibox" none="Robot Yüz" (click)="bottomBarEmoji('🤖')">🤖</div>
                <div class="emojibox" none="Kaka Yığını" (click)="bottomBarEmoji('💩')">💩</div>
                <div class="emoji-kategori-box">👦 ➤</div>
                <div class="emojibox" none="Oğlan" (click)="bottomBarEmoji('👦')">👦</div>
                <div class="emojibox" none="Bebek" (click)="bottomBarEmoji('👶')">👶</div>
                <div class="emojibox" none="Kız" (click)="bottomBarEmoji('👧')">👧</div>
                <div class="emojibox" none="Erkek" (click)="bottomBarEmoji('👨')">👨</div>
                <div class="emojibox" none="Kadın" (click)="bottomBarEmoji('👩')">👩</div>
                <div class="emojibox" none="Yaşlı Adam" (click)="bottomBarEmoji('👴')">👴</div>
                <div class="emojibox" none="Yaşlı Kadın" (click)="bottomBarEmoji('👵')">👵</div>
                <div class="emojibox" none="Uzaylı Canavar" (click)="bottomBarEmoji('👾')">👾</div>
                <div class="emojibox" none="Erkek Doktor" (click)="bottomBarEmoji('👨‍⚕️')">👨‍⚕️</div>
                <div class="emojibox" none="Kadın Doktor" (click)="bottomBarEmoji('👩‍⚕️')">👩‍⚕️</div>
                <div class="emojibox" none="Erkek Öğrenci" (click)="bottomBarEmoji('👨‍🎓')">👨‍🎓</div>
                <div class="emojibox" none="Kadın Öğrenci" (click)="bottomBarEmoji('👩‍🎓')">👩‍🎓</div>
                <div class="emojibox" none="Erkek Yargıç" (click)="bottomBarEmoji('👨‍⚖️')">👨‍⚖️</div>
                <div class="emojibox" none="Kadın Yargıç" (click)="bottomBarEmoji('👩‍⚖️')">👩‍⚖️</div>
                <div class="emojibox" none="Erkek Çiftçi" (click)="bottomBarEmoji('👨‍🌾')">👨‍🌾</div>
                <div class="emojibox" none="Kadın Çiftçi" (click)="bottomBarEmoji('👩‍🌾')">👩‍🌾</div>
                <div class="emojibox" none="Erkek Aşçı" (click)="bottomBarEmoji('👨‍🍳')">👨‍🍳</div>
                <div class="emojibox" none="Kadın Aşçı" (click)="bottomBarEmoji('👩‍🍳')">👩‍🍳</div>
                <div class="emojibox" none="Erkek Tamirci" (click)="bottomBarEmoji('👨‍🔧')">👨‍🔧</div>
                <div class="emojibox" none="Kadın Tamirci" (click)="bottomBarEmoji('👩‍🔧')">👩‍🔧</div>
                <div class="emojibox" none="Erkek Fabrika İşçisi" (click)="bottomBarEmoji('👨‍🏭')">👨‍🏭</div>
                <div class="emojibox" none="Kadın Fabrika İşçisi" (click)="bottomBarEmoji('👩‍🏭')">👩‍🏭</div>
                <div class="emojibox" none="Erkek Ofis Çalışanı" (click)="bottomBarEmoji('👨‍💼')">👨‍💼</div>
                <div class="emojibox" none="Kadın Ofis Çalışanı" (click)="bottomBarEmoji('👩‍💼')">👩‍💼</div>
                <div class="emojibox" none="Erkek Bilim İnsanı" (click)="bottomBarEmoji('👨‍🔬')">👨‍🔬</div>
                <div class="emojibox" none="Kadın Bilim İnsanı" (click)="bottomBarEmoji('👩‍🔬')">👩‍🔬</div>
                <div class="emojibox" none="Erkek Teknoloji Uzmanı" (click)="bottomBarEmoji('👨‍💻')">👨‍💻</div>
                <div class="emojibox" none="Kadın Teknoloji Uzmanı" (click)="bottomBarEmoji('👩‍💻')">👩‍💻</div>
                <div class="emojibox" none="Erkek Şarkıcı" (click)="bottomBarEmoji('👨‍🎤')">👨‍🎤</div>
                <div class="emojibox" none="Kadın Şarkıcı" (click)="bottomBarEmoji('👩‍🎤')">👩‍🎤</div>
                <div class="emojibox" none="Erkek Sanatcı" (click)="bottomBarEmoji('👨‍🎨')">👨‍🎨</div>
                <div class="emojibox" none="Kadın Sanatcı" (click)="bottomBarEmoji('👩‍🎨')">👩‍🎨</div>
                <div class="emojibox" none="Erkek Pilot" (click)="bottomBarEmoji('👨‍✈️')">👨‍✈️</div>
                <div class="emojibox" none="Kadın Pilot" (click)="bottomBarEmoji('👩‍✈️')">👩‍✈️</div>
                <div class="emojibox" none="Erkek Astronot" (click)="bottomBarEmoji('👨‍🚀')">👨‍🚀</div>
                <div class="emojibox" none="Kadın Astronot" (click)="bottomBarEmoji('👩‍🚀')">👩‍🚀</div>
                <div class="emojibox" none="Erkek İtfaiyeci" (click)="bottomBarEmoji('👨‍🚒')">👨‍🚒</div>
                <div class="emojibox" none="Kadın İtfaiyeci" (click)="bottomBarEmoji('👩‍🚒')">👩‍🚒</div>
                <div class="emojibox" none="Polis Memuru" (click)="bottomBarEmoji('👮')">👮</div>
                <div class="emojibox" none="Erkek Polis Memuru" (click)="bottomBarEmoji('👮‍♂️')">👮‍♂️</div>
                <div class="emojibox" none="Kadın Polis Memuru" (click)="bottomBarEmoji('👮‍♀️')">👮‍♀️</div>
                <div class="emojibox" none="Dedektif" (click)="bottomBarEmoji('🕵')">🕵</div>
                <div class="emojibox" none="Erkek Dedektif" (click)="bottomBarEmoji('🕵️‍♂️')">🕵️‍♂️</div>
                <div class="emojibox" none="Kadın Dedektif" (click)="bottomBarEmoji('🕵️‍♀️')">🕵️‍♀️</div>
                <div class="emojibox" none="Muhafız" (click)="bottomBarEmoji('💂')">💂</div>
                <div class="emojibox" none="Erkek Muhafız" (click)="bottomBarEmoji('💂‍♂️')">💂‍♂️</div>
                <div class="emojibox" none="Kadın Muhafız" (click)="bottomBarEmoji('💂‍♀️')">💂‍♀️</div>
                <div class="emojibox" none="İnşaat İşçisi" (click)="bottomBarEmoji('👷')">👷</div>
                <div class="emojibox" none="Erkek İnşaat İşçisi" (click)="bottomBarEmoji('👷‍♂️')">👷‍♂️</div>
                <div class="emojibox" none="Kadın İnşaat İşçisi" (click)="bottomBarEmoji('👷‍♀️')">👷‍♀️</div>
                <div class="emojibox" none="Prens" (click)="bottomBarEmoji('🤴')">🤴</div>
                <div class="emojibox" none="Prenses" (click)="bottomBarEmoji('👸')">👸</div>
                <div class="emojibox" none="Türban Giyen Kişi" (click)="bottomBarEmoji('👳')">👳</div>
                <div class="emojibox" none="Türban Giyen Adam" (click)="bottomBarEmoji('👳‍♂️')">👳‍♂️</div>
                <div class="emojibox" none="Türban Giyen Kadın" (click)="bottomBarEmoji('👳‍♀️')">👳‍♀️</div>
                <div class="emojibox" none="Çin Şapkalı Adam" (click)="bottomBarEmoji('👲')">👲</div>
                <div class="emojibox" none="Başörtülü Kadın" (click)="bottomBarEmoji('🧕')">🧕</div>
                <div class="emojibox" none="Sakallı Adam" (click)="bottomBarEmoji('🧔')">🧔</div>
                <div class="emojibox" none="Sarışın Erkek" (click)="bottomBarEmoji('👱')">👱</div>
                <div class="emojibox" none="Sarışın Adam" (click)="bottomBarEmoji('👱‍♂️')">👱‍♂️</div>
                <div class="emojibox" none="Sarışın Kadın" (click)="bottomBarEmoji('👱‍♀️')">👱‍♀️</div>
                <div class="emojibox" none="Smokinli Erkek" (click)="bottomBarEmoji('🤵')">🤵</div>
                <div class="emojibox" none="Peçeli Gelin" (click)="bottomBarEmoji('👰')">👰</div>
                <div class="emojibox" none="Hamile Kadın" (click)="bottomBarEmoji('🤰')">🤰</div>
                <div class="emojibox" none="Emzirme" (click)="bottomBarEmoji('🤱')">🤱</div>
                <div class="emojibox" none="Bebek Melek" (click)="bottomBarEmoji('👼')">👼</div>
                <div class="emojibox" none="Noel Baba" (click)="bottomBarEmoji('🎅')">🎅</div>
                <div class="emojibox" none="Noel Anne" (click)="bottomBarEmoji('🤶')">🤶</div>
                <div class="emojibox" none="Kadın Büyücü" (click)="bottomBarEmoji('🧙‍♀️')">🧙‍♀️</div>
                <div class="emojibox" none="Erkek Büyücü" (click)="bottomBarEmoji('🧙‍♂️')">🧙‍♂️</div>
                <div class="emojibox" none="Kadın Peri" (click)="bottomBarEmoji('🧚‍♀️')">🧚‍♀️</div>
                <div class="emojibox" none="Erkek Peri" (click)="bottomBarEmoji('🧚‍♂️')">🧚‍♂️</div>
                <div class="emojibox" none="Kadın Vampir" (click)="bottomBarEmoji('🧛‍♀️')">🧛‍♀️</div>
                <div class="emojibox" none="Erkek Vampir" (click)="bottomBarEmoji('🧛‍♂️')">🧛‍♂️</div>
                <div class="emojibox" none="Deniz Kızı" (click)="bottomBarEmoji('🧜‍♀️')">🧜‍♀️</div>
                <div class="emojibox" none="Deniz Erkeği" (click)="bottomBarEmoji('🧜‍♂️')">🧜‍♂️</div>
                <div class="emojibox" none="Kadın Elf" (click)="bottomBarEmoji('🧝‍♀️')">🧝‍♀️</div>
                <div class="emojibox" none="Erkek Elf" (click)="bottomBarEmoji('🧝‍♂️')">🧝‍♂️</div>
                <div class="emojibox" none="Kadın Cin" (click)="bottomBarEmoji('🧞‍♀️')">🧞‍♀️</div>
                <div class="emojibox" none="Erkek Cin" (click)="bottomBarEmoji('🧞‍♂️')">🧞‍♂️</div>
                <div class="emojibox" none="Kadın Zombi" (click)="bottomBarEmoji('🧟‍♀️')">🧟‍♀️</div>
                <div class="emojibox" none="Erkek Zombi" (click)="bottomBarEmoji('🧟‍♂️')">🧟‍♂️</div>
                <div class="emojibox" none="Kaşlarını Çatan Kişi" (click)="bottomBarEmoji('🙍')">🙍</div>
                <div class="emojibox" none="Kaşlarını Çatan Adam" (click)="bottomBarEmoji('🙍‍♂️')">🙍‍♂️</div>
                <div class="emojibox" none="Kaşlarını Çatan Kadın" (click)="bottomBarEmoji('🙍‍♀️')">🙍‍♀️</div>
                <div class="emojibox" none="Surat Asan Kişi" (click)="bottomBarEmoji('🙎')">🙎</div>
                <div class="emojibox" none="Somurtkan Adam" (click)="bottomBarEmoji('🙎‍♂️')">🙎‍♂️</div>
                <div class="emojibox" none="Somurtkan Kadın" (click)="bottomBarEmoji('🙎‍♀️')">🙎‍♀️</div>
                <div class="emojibox" none="Hayır İşareti Yapan Kadın" (click)="bottomBarEmoji('🙅')">🙅</div>
                <div class="emojibox" none="Hayır Yapan Adam" (click)="bottomBarEmoji('🙅‍♂️')">🙅‍♂️</div>
                <div class="emojibox" none="Hayır Yapan Kadın" (click)="bottomBarEmoji('🙅‍♀️')">🙅‍♀️</div>
                <div class="emojibox" none="İyi Hareket Eden Kişi" (click)="bottomBarEmoji('🙆')">🙆</div>
                <div class="emojibox" none="Tamam El Hareketi Yapan Adam" (click)="bottomBarEmoji('🙆‍♂️')">🙆‍♂️</div>
                <div class="emojibox" none="Tamam El Hareketi Yapan Kadın" (click)="bottomBarEmoji('🙆‍♀️')">🙆‍♀️</div>
                <div class="emojibox" none="Elini Deviren Kişi" (click)="bottomBarEmoji('💁')">💁</div>
                <div class="emojibox" none="Elini Deviren Erkek" (click)="bottomBarEmoji('💁‍♂️')">💁‍♂️</div>
                <div class="emojibox" none="Elini Deviren Kadın" (click)="bottomBarEmoji('💁‍♀️')">💁‍♀️</div>
                <div class="emojibox" none="El Kaldıran Kişi" (click)="bottomBarEmoji('🙋')">🙋</div>
                <div class="emojibox" none="El Kaldıran Adam" (click)="bottomBarEmoji('🙋‍♂️')">🙋‍♂️</div>
                <div class="emojibox" none="El Kaldıran Kadın" (click)="bottomBarEmoji('🙋‍♀️')">🙋‍♀️</div>
                <div class="emojibox" none="Eğilen Kişi" (click)="bottomBarEmoji('🙇')">🙇</div>
                <div class="emojibox" none="Eğilen Adam" (click)="bottomBarEmoji('🙇‍♂️')">🙇‍♂️</div>
                <div class="emojibox" none="Eğilen Kadın" (click)="bottomBarEmoji('🙇‍♀️')">🙇‍♀️</div>
                <div class="emojibox" none="Elini Başına Atan Kişi" (click)="bottomBarEmoji('🤦')">🤦</div>
                <div class="emojibox" none="Elini Başına Atan Erkek" (click)="bottomBarEmoji('🤦‍♂️')">🤦‍♂️</div>
                <div class="emojibox" none="Elini Başına Atan Kadın" (click)="bottomBarEmoji('🤦‍♀️')">🤦‍♀️</div>
                <div class="emojibox" none="Omuz Silken Kişi" (click)="bottomBarEmoji('🤷')">🤷</div>
                <div class="emojibox" none="Omuz Silken Adam" (click)="bottomBarEmoji('🤷‍♂️')">🤷‍♂️</div>
                <div class="emojibox" none="Omuz Silken Kadın" (click)="bottomBarEmoji('🤷‍♀️')">🤷‍♀️</div>
                <div class="emojibox" none="Masaj Yaptıran Kişi" (click)="bottomBarEmoji('💆')">💆</div>
                <div class="emojibox" none="Masaj Yaptıran Erkek" (click)="bottomBarEmoji('💆‍♂️')">💆‍♂️</div>
                <div class="emojibox" none="Masaj Yaptıran Kadın" (click)="bottomBarEmoji('💆‍♀️')">💆‍♀️</div>
                <div class="emojibox" none="Saç Kestiren Kişi" (click)="bottomBarEmoji('💇')">💇</div>
                <div class="emojibox" none="Saç Kestiren Erkek" (click)="bottomBarEmoji('💇‍♂️')">💇‍♂️</div>
                <div class="emojibox" none="Saç Kestiren Kadın" (click)="bottomBarEmoji('💇‍♀️')">💇‍♀️</div>
                <div class="emojibox" none="Yürüyen Kişi" (click)="bottomBarEmoji('🚶')">🚶</div>
                <div class="emojibox" none="Yürüyen Adam" (click)="bottomBarEmoji('🚶‍♂️')">🚶‍♂️</div>
                <div class="emojibox" none="Yürüyen Kadın" (click)="bottomBarEmoji('🚶‍♀️')">🚶‍♀️</div>
                <div class="emojibox" none="Koşan Kişi" (click)="bottomBarEmoji('🏃')">🏃</div>
                <div class="emojibox" none="Koşan Adam" (click)="bottomBarEmoji('🏃‍♂️')">🏃‍♂️</div>
                <div class="emojibox" none="Koşan Kadın" (click)="bottomBarEmoji('🏃‍♀️')">🏃‍♀️</div>
                <div class="emojibox" none="Dans Eden Kadın" (click)="bottomBarEmoji('💃')">💃</div>
                <div class="emojibox" none="Dans Eden Erkek" (click)="bottomBarEmoji('🕺')">🕺</div>
                <div class="emojibox" none="Tavşan Kulaklı İnsanlar" (click)="bottomBarEmoji('👯')">👯</div>
                <div class="emojibox" none="Tavşan Kulaklı Erkekler" (click)="bottomBarEmoji('👯‍♂️')">👯‍♂️</div>
                <div class="emojibox" none="Tavşan Kulaklı Kadınlar" (click)="bottomBarEmoji('👯‍♀️')">👯‍♀️</div>
                <div class="emojibox" none="Buhar Odasındaki Kadın" (click)="bottomBarEmoji('🧖‍♀️')">🧖‍♀️</div>
                <div class="emojibox" none="Buhar Odasındaki Erkek" (click)="bottomBarEmoji('🧖‍♂️')">🧖‍♂️</div>
                <div class="emojibox" none="Takım Elbise Giyen Adam" (click)="bottomBarEmoji('🕴')">🕴</div>
                <div class="emojibox" none="Siluette Göğüs" (click)="bottomBarEmoji('👤')">👤</div>
                <div class="emojibox" none="Siluette Büstler" (click)="bottomBarEmoji('👥')">👥</div>
                <div class="emojibox" none="El Ele Tutuşan Erkek ve Kadın" (click)="bottomBarEmoji('👫')">👫</div>
                <div class="emojibox" none="El Ele Tutuşan İki Adam" (click)="bottomBarEmoji('👬')">👬</div>
                <div class="emojibox" none="El Ele Tutuşan İki Kadın" (click)="bottomBarEmoji('👭')">👭</div>
                <div class="emojibox" none="Öpücük" (click)="bottomBarEmoji('💏')">💏</div>
                <div class="emojibox" none="Öpücük: Erkek, Erkek" (click)="bottomBarEmoji('👨‍❤️‍💋‍👨')">👨‍❤️‍💋‍👨</div>
                <div class="emojibox" none="Öpücük: Kadın, Kadın" (click)="bottomBarEmoji('👩‍❤️‍💋‍👩')">👩‍❤️‍💋‍👩</div>
                <div class="emojibox" none="Çift ile Kalp" (click)="bottomBarEmoji('💑')">💑</div>
                <div class="emojibox" none="Kalpli Çift: Adam, Adam" (click)="bottomBarEmoji('👨‍❤️‍👨')">👨‍❤️‍👨</div>
                <div class="emojibox" none="Kalpli Çift: Kadın, Kadın" (click)="bottomBarEmoji('👩‍❤️‍👩')">👩‍❤️‍👩</div>
                <div class="emojibox" none="Aile" (click)="bottomBarEmoji('👪')">👪</div>
                <div class="emojibox" none="Aile: Erkek, Kadın, Erkek" (click)="bottomBarEmoji('👨‍👩‍👦')">👨‍👩‍👦</div>
                <div class="emojibox" none="Aile: Erkek, Kadın, Kız" (click)="bottomBarEmoji('👨‍👩‍👧')">👨‍👩‍👧</div>
                <div class="emojibox" none="Aile: Kadın, Kız, Erkek" (click)="bottomBarEmoji('👨‍👩‍👧‍👦')">👨‍👩‍👧‍👦</div>
                <div class="emojibox" none="Aile: Erkek, Kadın, Oğlan, Oğlan" (click)="bottomBarEmoji('👨‍👩‍👦‍👦')">👨‍👩‍👦‍👦</div>
                <div class="emojibox" none="Aile: Erkek, Kadın, Kız, Kız" (click)="bottomBarEmoji('👨‍👩‍👧‍👧')">👨‍👩‍👧‍👧</div>
                <div class="emojibox" none="Aile: Erkek, Erkek, Oğlan" (click)="bottomBarEmoji('👨‍👨‍👦')">👨‍👨‍👦</div>
                <div class="emojibox" none="Aile: Erkek, Erkek, Kız" (click)="bottomBarEmoji('👨‍👨‍👧')">👨‍👨‍👧</div>
                <div class="emojibox" none="Aile: Erkek, Erkek, Kız, Oğlan" (click)="bottomBarEmoji('👨‍👨‍👧‍👦')">👨‍👨‍👧‍👦</div>
                <div class="emojibox" none="Aile: Erkek, Erkek, Oğlan, Oğlan" (click)="bottomBarEmoji('👨‍👨‍👦‍👦')">👨‍👨‍👦‍👦</div>
                <div class="emojibox" none="Aile: Erkek, Erkek, Kız, Kız" (click)="bottomBarEmoji('👨‍👨‍👧‍👧')">👨‍👨‍👧‍👧</div>
                <div class="emojibox" none="Aile: Kadın, Kadın, Erkek" (click)="bottomBarEmoji('👩‍👩‍👦')">👩‍👩‍👦</div>
                <div class="emojibox" none="Aile: Kadın, Kadın, Kız" (click)="bottomBarEmoji('👩‍👩‍👧')">👩‍👩‍👧</div>
                <div class="emojibox" none="Aile: Kadın, Kadın, Kız, Erkek" (click)="bottomBarEmoji('👩‍👩‍👧‍👦')">👩‍👩‍👧‍👦</div>
                <div class="emojibox" none="Aile: Kadın, Kadın, Oğlan, Oğlan" (click)="bottomBarEmoji('👩‍👩‍👦‍👦')">👩‍👩‍👦‍👦</div>
                <div class="emojibox" none="Aile: Kadın, Kadın, Kız, Kız" (click)="bottomBarEmoji('👩‍👩‍👧‍👧')">👩‍👩‍👧‍👧</div>
                <div class="emojibox" none="Aile: Erkek, Erkek" (click)="bottomBarEmoji('👨‍👦')">👨‍👦</div>
                <div class="emojibox" none="Aile: Erkek, Oğlan, Oğlan" (click)="bottomBarEmoji('👨‍👦‍👦')">👨‍👦‍👦</div> 
                <div class="emojibox" none="Aile: Erkek, Kız" (click)="bottomBarEmoji('👨‍👧')">👨‍👧</div>
                <div class="emojibox" none="Aile: Erkek, Kız, Erkek" (click)="bottomBarEmoji('👨‍👧‍👦')">👨‍👧‍👦</div>
                <div class="emojibox" none="Aile: Erkek, Kız, Kız" (click)="bottomBarEmoji('👨‍👧‍👧')">👨‍👧‍👧</div>
                <div class="emojibox" none="Aile: Kadın, Erkek" (click)="bottomBarEmoji('👩‍👦')">👩‍👦</div>
                <div class="emojibox" none="Aile: Kadın, Erkek, Erkek" (click)="bottomBarEmoji('👩‍👦‍👦')">👩‍👦‍👦</div>
                <div class="emojibox" none="Aile: Kadın, Kız" (click)="bottomBarEmoji('👩‍👧')">👩‍👧</div>
                <div class="emojibox" none="Aile: Kadın, Kız, Erkek" (click)="bottomBarEmoji('👩‍👧‍👦')">👩‍👧‍👦</div>
                <div class="emojibox" none="Aile: Kadın, Kız, Kız" (click)="bottomBarEmoji('👩‍👧‍👧')">👩‍👧‍👧</div>
                <div class="emoji-kategori-box">😺 ➤</div>
                <div class="emojibox" none="Sırıtan Kedi Yüzü" (click)="bottomBarEmoji('😺')">😺</div>
                <div class="emojibox" none="Gülen Gözlerle Sırıtan Kedi Yüzü" (click)="bottomBarEmoji('😸')">😸</div>
                <div class="emojibox" none="Sevinç Gözyaşlarıyla Kedi Yüzü" (click)="bottomBarEmoji('😹')">😹</div>
                <div class="emojibox" none="Kalp Gözlü Gülümseyen Kedi Yüzü" (click)="bottomBarEmoji('😻')">😻</div>
                <div class="emojibox" none="Alaycı Bir Gülümseme ile Kedi Yüzü" (click)="bottomBarEmoji('😼')">😼</div>
                <div class="emojibox" none="Kedi Yüzü Öpüşme" (click)="bottomBarEmoji('😽')">😽</div>
                <div class="emojibox" none="Yorgun Kedi Yüzü" (click)="bottomBarEmoji('🙀')">🙀</div>
                <div class="emojibox" none="Ağlayan Kedi Yüzü" (click)="bottomBarEmoji('😿')">😿</div>
                <div class="emojibox" none="Somurtkan Kedi Yüzü" (click)="bottomBarEmoji('😾')">😾</div>
                <div class="emojibox" none="Gözünü Kapatan Maymun" (click)="bottomBarEmoji('🙈')">🙈</div>
                <div class="emojibox" none="Duymayan Maymun" (click)="bottomBarEmoji('🙉')">🙉</div>
                <div class="emojibox" none="Ağzını Kapatan Maymun" (click)="bottomBarEmoji('🙊')">🙊</div>
                <div class="emojibox" none="Çarpışma" (click)="bottomBarEmoji('💥')">💥</div>
                <div class="emojibox" none="Maymun Surat" (click)="bottomBarEmoji('🐵')">🐵</div>
                <div class="emojibox" none="Maymun" (click)="bottomBarEmoji('🐒')">🐒</div>
                <div class="emojibox" none="Goril" (click)="bottomBarEmoji('🦍')">🦍</div>
                <div class="emojibox" none="Köpek Yüzü" (click)="bottomBarEmoji('🐶')">🐶</div>
                <div class="emojibox" none="Köpek" (click)="bottomBarEmoji('🐕')">🐕</div>
                <div class="emojibox" none="Kaniş" (click)="bottomBarEmoji('🐩')">🐩</div>
                <div class="emojibox" none="Kurt Yüzü" (click)="bottomBarEmoji('🐺')">🐺</div>
                <div class="emojibox" none="Tilki Yüzü" (click)="bottomBarEmoji('🦊')">🦊</div>
                <div class="emojibox" none="Kedi Surat" (click)="bottomBarEmoji('🐱')">🐱</div>
                <div class="emojibox" none="Kedi" (click)="bottomBarEmoji('🐈')">🐈</div>
                <div class="emojibox" none="Aslan Yüzü" (click)="bottomBarEmoji('🦁')">🦁</div>
                <div class="emojibox" none="Kaplan Yüzü" (click)="bottomBarEmoji('🐯')">🐯</div>
                <div class="emojibox" none="Kaplan" (click)="bottomBarEmoji('🐅')">🐅</div>
                <div class="emojibox" none="Leopar" (click)="bottomBarEmoji('🐆')">🐆</div>
                <div class="emojibox" none="At Yüzü" (click)="bottomBarEmoji('🐴')">🐴</div>
                <div class="emojibox" none="At" (click)="bottomBarEmoji('🐎')">🐎</div>
                <div class="emojibox" none="Tek Boynuzlu At" (click)="bottomBarEmoji('🦄')">🦄</div>
                <div class="emojibox" none="Zebra" (click)="bottomBarEmoji('🦓')">🦓</div>
                <div class="emojibox" none="İnek Yüzü" (click)="bottomBarEmoji('🐮')">🐮</div>
                <div class="emojibox" none="Öküz" (click)="bottomBarEmoji('🐂')">🐂</div>
                <div class="emojibox" none="Manda" (click)="bottomBarEmoji('🐃')">🐃</div>
                <div class="emojibox" none="İnek" (click)="bottomBarEmoji('🐄')">🐄</div>
                <div class="emojibox" none="Domuz Suratı" (click)="bottomBarEmoji('🐷')">🐷</div>
                <div class="emojibox" none="Domuz" (click)="bottomBarEmoji('🐖')">🐖</div>
                <div class="emojibox" none="Domuz" (click)="bottomBarEmoji('🐗')">🐗</div>
                <div class="emojibox" none="Domuz Burnu" (click)="bottomBarEmoji('🐽')">🐽</div>
                <div class="emojibox" none="Koyun" (click)="bottomBarEmoji('🐏')">🐏</div>
                <div class="emojibox" none="Koyun" (click)="bottomBarEmoji('🐑')">🐑</div>
                <div class="emojibox" none="Keçi" (click)="bottomBarEmoji('🐐')">🐐</div>
                <div class="emojibox" none="Deve" (click)="bottomBarEmoji('🐪')">🐪</div>
                <div class="emojibox" none="Deve" (click)="bottomBarEmoji('🐫')">🐫</div>
                <div class="emojibox" none="Zürafa" (click)="bottomBarEmoji('🦒')">🦒</div>
                <div class="emojibox" none="Fil" (click)="bottomBarEmoji('🐘')">🐘</div>
                <div class="emojibox" none="Gergedan" (click)="bottomBarEmoji('🦏')">🦏</div>
                <div class="emojibox" none="Fare Yüzü" (click)="bottomBarEmoji('🐭')">🐭</div>
                <div class="emojibox" none="Fare" (click)="bottomBarEmoji('🐁')">🐁</div>
                <div class="emojibox" none="Sıçan" (click)="bottomBarEmoji('🐀')">🐀</div>
                <div class="emojibox" none="Hamster Yüzü" (click)="bottomBarEmoji('🐹')">🐹</div>
                <div class="emojibox" none="Tavşan Yüzü" (click)="bottomBarEmoji('🐰')">🐰</div>
                <div class="emojibox" none="Tavşan" (click)="bottomBarEmoji('🐇')">🐇</div>
                <div class="emojibox" none="Kirpi" (click)="bottomBarEmoji('🦔')">🦔</div>
                <div class="emojibox" none="Yarasa" (click)="bottomBarEmoji('🦇')">🦇</div>
                <div class="emojibox" none="Ayı Yüzü" (click)="bottomBarEmoji('🐻')">🐻</div>
                <div class="emojibox" none="Koala" (click)="bottomBarEmoji('🐨')">🐨</div>
                <div class="emojibox" none="Panda Yüzü" (click)="bottomBarEmoji('🐼')">🐼</div>
                <div class="emojibox" none="Pati İzleri" (click)="bottomBarEmoji('🐾')">🐾</div>
                <div class="emojibox" none="Horoz" (click)="bottomBarEmoji('🦃')">🦃</div>
                <div class="emojibox" none="Tavuk" (click)="bottomBarEmoji('🐔')">🐔</div>
                <div class="emojibox" none="Horoz" (click)="bottomBarEmoji('🐓')">🐓</div>
                <div class="emojibox" none="Civciv" (click)="bottomBarEmoji('🐣')">🐣</div>
                <div class="emojibox" none="Civciv" (click)="bottomBarEmoji('🐤')">🐤</div>
                <div class="emojibox" none="Öne Bakan Civciv" (click)="bottomBarEmoji('🐥')">🐥</div>
                <div class="emojibox" none="Kuş" (click)="bottomBarEmoji('🐦')">🐦</div>
                <div class="emojibox" none="Penguen" (click)="bottomBarEmoji('🐧')">🐧</div>
                <div class="emojibox" none="Kartal" (click)="bottomBarEmoji('🦅')">🦅</div>
                <div class="emojibox" none="Ördek" (click)="bottomBarEmoji('🦆')">🦆</div>
                <div class="emojibox" none="Baykuş" (click)="bottomBarEmoji('🦉')">🦉</div>
                <div class="emojibox" none="Kurbağa Yüzü" (click)="bottomBarEmoji('🐸')">🐸</div>
                <div class="emojibox" none="Timsah" (click)="bottomBarEmoji('🐊')">🐊</div>
                <div class="emojibox" none="Kaplumbağa" (click)="bottomBarEmoji('🐢')">🐢</div>
                <div class="emojibox" none="Kertenkele" (click)="bottomBarEmoji('🦎')">🦎</div>
                <div class="emojibox" none="Yılan" (click)="bottomBarEmoji('🐍')">🐍</div>
                <div class="emojibox" none="Ejderha Yüzü" (click)="bottomBarEmoji('🐲')">🐲</div>
                <div class="emojibox" none="Ejderha" (click)="bottomBarEmoji('🐉')">🐉</div>
                <div class="emojibox" none="Sauropod" (click)="bottomBarEmoji('🦕')">🦕</div>
                <div class="emojibox" none="T-Rex" (click)="bottomBarEmoji('🦖')">🦖</div>
                <div class="emojibox" none="Fışkıran Balina" (click)="bottomBarEmoji('🐳')">🐳</div>
                <div class="emojibox" none="Balina" (click)="bottomBarEmoji('🐋')">🐋</div>
                <div class="emojibox" none="Yunus" (click)="bottomBarEmoji('🐬')">🐬</div>
                <div class="emojibox" none="Balık" (click)="bottomBarEmoji('🐟')">🐟</div>
                <div class="emojibox" none="Tropikal Balık" (click)="bottomBarEmoji('🐠')">🐠</div>
                <div class="emojibox" none="Balon Balığı" (click)="bottomBarEmoji('🐡')">🐡</div>
                <div class="emojibox" none="Köpek Balığı" (click)="bottomBarEmoji('🦈')">🦈</div>
                <div class="emojibox" none="Ahtapot" (click)="bottomBarEmoji('🐙')">🐙</div>
                <div class="emojibox" none="Spiral Kabuk" (click)="bottomBarEmoji('🐚')">🐚</div>
                <div class="emojibox" none="Yengeç" (click)="bottomBarEmoji('🦀')">🦀</div>
                <div class="emojibox" none="Karides" (click)="bottomBarEmoji('🦐')">🦐</div>
                <div class="emojibox" none="Kalamar" (click)="bottomBarEmoji('🦑')">🦑</div>
                <div class="emojibox" none="Salyangoz" (click)="bottomBarEmoji('🐌')">🐌</div>
                <div class="emojibox" none="Kelebek" (click)="bottomBarEmoji('🦋')">🦋</div>
                <div class="emojibox" none="Tırtıl" (click)="bottomBarEmoji('🐛')">🐛</div>
                <div class="emojibox" none="Karınca" (click)="bottomBarEmoji('🐜')">🐜</div>
                <div class="emojibox" none="Bal Arısı" (click)="bottomBarEmoji('🐝')">🐝</div>
                <div class="emojibox" none="Uğur Böceği" (click)="bottomBarEmoji('🐞')">🐞</div>
                <div class="emojibox" none="Kriket" (click)="bottomBarEmoji('🦗')">🦗</div>
                <div class="emojibox" none="Akrep" (click)="bottomBarEmoji('🦂')">🦂</div>
                <div class="emoji-kategori-box">💐 ➤</div>
                <div class="emojibox" none="Buket" (click)="bottomBarEmoji('💐')">💐</div>
                <div class="emojibox" none="Kiraz Çiçeği" (click)="bottomBarEmoji('🌸')">🌸</div>
                <div class="emojibox" none="Beyaz Çiçek" (click)="bottomBarEmoji('💮')">💮</div>
                <div class="emojibox" none="Gül" (click)="bottomBarEmoji('🌹')">🌹</div>
                <div class="emojibox" none="Solmuş Gül" (click)="bottomBarEmoji('🥀')">🥀</div>
                <div class="emojibox" none="Ebegümeci" (click)="bottomBarEmoji('🌺')">🌺</div>
                <div class="emojibox" none="Ayçiçeği" (click)="bottomBarEmoji('🌻')">🌻</div>
                <div class="emojibox" none="Çiçek" (click)="bottomBarEmoji('🌼')">🌼</div>
                <div class="emojibox" none="Lale" (click)="bottomBarEmoji('🌷')">🌷</div>
                <div class="emojibox" none="Fidan" (click)="bottomBarEmoji('🌱')">🌱</div>
                <div class="emojibox" none="Yaprak Dökmeyen Ağaç" (click)="bottomBarEmoji('🌲')">🌲</div>
                <div class="emojibox" none="Yaprak Döken Ağaç" (click)="bottomBarEmoji('🌳')">🌳</div>
                <div class="emojibox" none="Palmiye" (click)="bottomBarEmoji('🌴')">🌴</div>
                <div class="emojibox" none="Kaktüs" (click)="bottomBarEmoji('🌵')">🌵</div>
                <div class="emojibox" none="Pirinç Demeti" (click)="bottomBarEmoji('🌾')">🌾</div>
                <div class="emojibox" none="Ot" (click)="bottomBarEmoji('🌿')">🌿</div>
                <div class="emojibox" none="Dört Yapraklı Yonca" (click)="bottomBarEmoji('🍀')">🍀</div>
                <div class="emojibox" none="Akçaağaç Yaprağı" (click)="bottomBarEmoji('🍁')">🍁</div>
                <div class="emojibox" none="Düşen Yaprak" (click)="bottomBarEmoji('🍂')">🍂</div>
                <div class="emojibox" none="Rüzgarda Çırpınan Yaprak" (click)="bottomBarEmoji('🍃')">🍃</div>
                <div class="emojibox" none="Mantar" (click)="bottomBarEmoji('🍄')">🍄</div>
                <div class="emojibox" none="Kestane" (click)="bottomBarEmoji('🌰')">🌰</div>
                <div class="emoji-kategori-box">🌍 ➤</div>
                <div class="emojibox" none="Avrupa-Afrika Gösteren Dünya" (click)="bottomBarEmoji('🌍')">🌍</div>
                <div class="emojibox" none="Amerikayı Gösteren Dünya" (click)="bottomBarEmoji('🌎')">🌎</div>
                <div class="emojibox" none="Asya-Avustralya Gösteren Dünya" (click)="bottomBarEmoji('🌏')">🌏</div>
                <div class="emojibox" none="Meridyenli Küre" (click)="bottomBarEmoji('🌐')">🌐</div>
                <div class="emojibox" none="Yeni Ay" (click)="bottomBarEmoji('🌑')">🌑</div>
                <div class="emojibox" none="Hilal Ayı" (click)="bottomBarEmoji('🌒')">🌒</div>
                <div class="emojibox" none="İlk Çeyrek Ay" (click)="bottomBarEmoji('🌓')">🌓</div>
                <div class="emojibox" none="Kambur Ay" (click)="bottomBarEmoji('🌔')">🌔</div>
                <div class="emojibox" none="Dolunay" (click)="bottomBarEmoji('🌕')">🌕</div>
                <div class="emojibox" none="Küçülen Ay" (click)="bottomBarEmoji('🌖')">🌖</div>
                <div class="emojibox" none="Son Çeyrek Ay" (click)="bottomBarEmoji('🌗')">🌗</div>
                <div class="emojibox" none="Hilal Ayı" (click)="bottomBarEmoji('🌘')">🌘</div>
                <div class="emojibox" none="Hilal" (click)="bottomBarEmoji('🌙')">🌙</div>
                <div class="emojibox" none="Yeni Ay Yüzü" (click)="bottomBarEmoji('🌚')">🌚</div>
                <div class="emojibox" none="İlk Çeyrek Ay Yüzü" (click)="bottomBarEmoji('🌛')">🌛</div>
                <div class="emojibox" none="Son Çeyrek Ay Yüzü" (click)="bottomBarEmoji('🌜')">🌜</div>
                <div class="emojibox" none="Dolunay Yüzü" (click)="bottomBarEmoji('🌝')">🌝</div>
                <div class="emojibox" none="Güneş Yüzü" (click)="bottomBarEmoji('🌞')">🌞</div>
                <div class="emojibox" none="Beyaz Orta Yıldız" (click)="bottomBarEmoji('⭐')">⭐</div>
                <div class="emojibox" none="Parlayan Yıldız" (click)="bottomBarEmoji('🌟')">🌟</div>
                <div class="emojibox" none="Kayan Yıldız" (click)="bottomBarEmoji('🌠')">🌠</div>
                <div class="emojibox" none="Bulut" (click)="bottomBarEmoji('☁')">☁</div>
                <div class="emojibox" none="Bulut Arkasındaki Güneş" (click)="bottomBarEmoji('⛅')">⛅</div>
                <div class="emojibox" none="Gökkuşağı" (click)="bottomBarEmoji('🌈')">🌈</div>
                <div class="emojibox" none="Yağmur Damlalı Şemsiye" (click)="bottomBarEmoji('☔')">☔</div>
                <div class="emojibox" none="Şimşek" (click)="bottomBarEmoji('⚡')">⚡</div>
                <div class="emojibox" none="Kardan Adam" (click)="bottomBarEmoji('⛄')">⛄</div>
                <div class="emojibox" none="Ateş" (click)="bottomBarEmoji('🔥')">🔥</div>
                <div class="emojibox" none="Damlacık" (click)="bottomBarEmoji('💧')">💧</div>
                <div class="emojibox" none="Su Dalgası" (click)="bottomBarEmoji('🌊')">🌊</div>
                <div class="emojibox" none="Noel Ağacı" (click)="bottomBarEmoji('🎄')">🎄</div>
                <div class="emojibox" none="Parıltı" (click)="bottomBarEmoji('✨')">✨</div>
                <div class="emojibox" none="Tanabata Ağacı" (click)="bottomBarEmoji('🎋')">🎋</div>
                <div class="emojibox" none="Çam Dekorasyonu" (click)="bottomBarEmoji('🎍')">🎍</div>
                <div class="emoji-kategori-box">🍔 ➤</div>
                <div class="emojibox" none="Üzüm" (click)="bottomBarEmoji('🍇')">🍇</div>
                <div class="emojibox" none="Kavun" (click)="bottomBarEmoji('🍈')">🍈</div>
                <div class="emojibox" none="Karpuz" (click)="bottomBarEmoji('🍉')">🍉</div>
                <div class="emojibox" none="Mandalina" (click)="bottomBarEmoji('🍊')">🍊</div>
                <div class="emojibox" none="Limon" (click)="bottomBarEmoji('🍋')">🍋</div>
                <div class="emojibox" none="Muz" (click)="bottomBarEmoji('🍌')">🍌</div>
                <div class="emojibox" none="Ananas" (click)="bottomBarEmoji('🍍')">🍍</div>
                <div class="emojibox" none="Kırmızı Elma" (click)="bottomBarEmoji('🍎')">🍎</div>
                <div class="emojibox" none="Yeşil Elma" (click)="bottomBarEmoji('🍏')">🍏</div>
                <div class="emojibox" none="Armut" (click)="bottomBarEmoji('🍐')">🍐</div>
                <div class="emojibox" none="Şeftali" (click)="bottomBarEmoji('🍑')">🍑</div>
                <div class="emojibox" none="Kiraz" (click)="bottomBarEmoji('🍒')">🍒</div>
                <div class="emojibox" none="Çilek" (click)="bottomBarEmoji('🍓')">🍓</div>
                <div class="emojibox" none="Kivi" (click)="bottomBarEmoji('🥝')">🥝</div>
                <div class="emojibox" none="Domates" (click)="bottomBarEmoji('🍅')">🍅</div>
                <div class="emojibox" none="Hindistan Cevizi" (click)="bottomBarEmoji('🥥')">🥥</div>
                <div class="emojibox" none="Avokado" (click)="bottomBarEmoji('🥑')">🥑</div>
                <div class="emojibox" none="Patlıcan" (click)="bottomBarEmoji('🍆')">🍆</div>
                <div class="emojibox" none="Patates" (click)="bottomBarEmoji('🥔')">🥔</div>
                <div class="emojibox" none="Havuç" (click)="bottomBarEmoji('🥕')">🥕</div>
                <div class="emojibox" none="Mısır" (click)="bottomBarEmoji('🌽')">🌽</div>
                <div class="emojibox" none="Salatalık" (click)="bottomBarEmoji('🥒')">🥒</div>
                <div class="emojibox" none="Brokoli" (click)="bottomBarEmoji('🥦')">🥦</div>
                <div class="emojibox" none="Yer Fıstığı" (click)="bottomBarEmoji('🥜')">🥜</div>
                <div class="emojibox" none="Ekmek" (click)="bottomBarEmoji('🍞')">🍞</div>
                <div class="emojibox" none="Kruvasan" (click)="bottomBarEmoji('🥐')">🥐</div>
                <div class="emojibox" none="Baget Ekmek" (click)="bottomBarEmoji('🥖')">🥖</div>
                <div class="emojibox" none="Çubuk Kraker" (click)="bottomBarEmoji('🥨')">🥨</div>
                <div class="emojibox" none="Krep" (click)="bottomBarEmoji('🥞')">🥞</div>
                <div class="emojibox" none="Peynir Dilimi" (click)="bottomBarEmoji('🧀')">🧀</div>
                <div class="emojibox" none="Kemikli Et" (click)="bottomBarEmoji('🍖')">🍖</div>
                <div class="emojibox" none="Kanat" (click)="bottomBarEmoji('🍗')">🍗</div>
                <div class="emojibox" none="Kesilmiş Et" (click)="bottomBarEmoji('🥩')">🥩</div>
                <div class="emojibox" none="Domuz Pastırması" (click)="bottomBarEmoji('🥓')">🥓</div>
                <div class="emojibox" none="Hamburger" (click)="bottomBarEmoji('🍔')">🍔</div>
                <div class="emojibox" none="Patates Kızartması" (click)="bottomBarEmoji('🍟')">🍟</div>
                <div class="emojibox" none="Pizza" (click)="bottomBarEmoji('🍕')">🍕</div>
                <div class="emojibox" none="Sosisli" (click)="bottomBarEmoji('🌭')">🌭</div>
                <div class="emojibox" none="Sandviç" (click)="bottomBarEmoji('🥪')">🥪</div>
                <div class="emojibox" none="Taco" (click)="bottomBarEmoji('🌮')">🌮</div>
                <div class="emojibox" none="Burrito" (click)="bottomBarEmoji('🌯')">🌯</div>
                <div class="emojibox" none="Yemek Pişirme" (click)="bottomBarEmoji('🍳')">🍳</div>
                <div class="emojibox" none="Kap Yemek" (click)="bottomBarEmoji('🍲')">🍲</div>
                <div class="emojibox" none="Kaşıklı Kase" (click)="bottomBarEmoji('🥣')">🥣</div>
                <div class="emojibox" none="Yeşil Salata" (click)="bottomBarEmoji('🥗')">🥗</div>
                <div class="emojibox" none="Patlamış Mısır" (click)="bottomBarEmoji('🍿')">🍿</div>
                <div class="emojibox" none="Konserve" (click)="bottomBarEmoji('🥫')">🥫</div>
                <div class="emojibox" none="Bento Kutusu" (click)="bottomBarEmoji('🍱')">🍱</div>
                <div class="emojibox" none="Pirinç Kraker" (click)="bottomBarEmoji('🍘')">🍘</div>
                <div class="emojibox" none="Pirinç Topu" (click)="bottomBarEmoji('🍙')">🍙</div>
                <div class="emojibox" none="Pişmiş Pirinç" (click)="bottomBarEmoji('🍚')">🍚</div>
                <div class="emojibox" none="Köri Pirinç" (click)="bottomBarEmoji('🍛')">🍛</div>
                <div class="emojibox" none="Buharlama Kasesi" (click)="bottomBarEmoji('🍜')">🍜</div>
                <div class="emojibox" none="Spagetti" (click)="bottomBarEmoji('🍝')">🍝</div>
                <div class="emojibox" none="Kavrulmuş Tatlı Patates" (click)="bottomBarEmoji('🍠')">🍠</div>
                <div class="emojibox" none="Oden" (click)="bottomBarEmoji('🍢')">🍢</div>
                <div class="emojibox" none="Suşi" (click)="bottomBarEmoji('🍣')">🍣</div>
                <div class="emojibox" none="Kızarmış Karides" (click)="bottomBarEmoji('🍤')">🍤</div>
                <div class="emojibox" none="Girdaplı Balık Kek" (click)="bottomBarEmoji('🍥')">🍥</div>
                <div class="emojibox" none="Dango" (click)="bottomBarEmoji('🍡')">🍡</div>
                <div class="emojibox" none="Hamur Tatlısı" (click)="bottomBarEmoji('🥟')">🥟</div>
                <div class="emojibox" none="Şans Kurabiyesi" (click)="bottomBarEmoji('🥠')">🥠</div>
                <div class="emojibox" none="Paket Servisi Kutusu" (click)="bottomBarEmoji('🥡')">🥡</div>
                <div class="emojibox" none="Yumuşak Dondurma" (click)="bottomBarEmoji('🍦')">🍦</div>
                <div class="emojibox" none="Traşlanmış Buz" (click)="bottomBarEmoji('🍧')">🍧</div>
                <div class="emojibox" none="Dondurma" (click)="bottomBarEmoji('🍨')">🍨</div>
                <div class="emojibox" none="Tatlı Çörek" (click)="bottomBarEmoji('🍩')">🍩</div>
                <div class="emojibox" none="Kurabiye" (click)="bottomBarEmoji('🍪')">🍪</div>
                <div class="emojibox" none="Doğum Günü Pastası" (click)="bottomBarEmoji('🎂')">🎂</div>
                <div class="emojibox" none="Pasta Dilimi" (click)="bottomBarEmoji('🍰')">🍰</div>
                <div class="emojibox" none="Turta" (click)="bottomBarEmoji('🥧')">🥧</div>
                <div class="emojibox" none="Çikolata" (click)="bottomBarEmoji('🍫')">🍫</div>
                <div class="emojibox" none="Şeker" (click)="bottomBarEmoji('🍬')">🍬</div>
                <div class="emojibox" none="Lolipop" (click)="bottomBarEmoji('🍭')">🍭</div>
                <div class="emojibox" none="Muhallebi" (click)="bottomBarEmoji('🍮')">🍮</div>
                <div class="emojibox" none="Bal Küpü" (click)="bottomBarEmoji('🍯')">🍯</div>
                <div class="emojibox" none="Biberon" (click)="bottomBarEmoji('🍼')">🍼</div>
                <div class="emojibox" none="Bir Bardak Süt" (click)="bottomBarEmoji('🥛')">🥛</div>
                <div class="emojibox" none="Bir Fincan Sıcak İçecek" (click)="bottomBarEmoji('☕')">☕</div>
                <div class="emojibox" none="Sapsız Çay Fincanı" (click)="bottomBarEmoji('🍵')">🍵</div>
                <div class="emojibox" none="Hatır" (click)="bottomBarEmoji('🍶')">🍶</div>
                <div class="emojibox" none="Haşhaş Mantarlı Şişe" (click)="bottomBarEmoji('🍾')">🍾</div>
                <div class="emojibox" none="Şarap Bardağı" (click)="bottomBarEmoji('🍷')">🍷</div>
                <div class="emojibox" none="Kokteyl Bardağı" (click)="bottomBarEmoji('🍸')">🍸</div>
                <div class="emojibox" none="Tropikal İçecek" (click)="bottomBarEmoji('🍹')">🍹</div>
                <div class="emojibox" none="Bira Kupası" (click)="bottomBarEmoji('🍺')">🍺</div>
                <div class="emojibox" none="Tungur Bira Kupaları" (click)="bottomBarEmoji('🍻')">🍻</div>
                <div class="emojibox" none="Tokuşturulan Bira Bardakları" (click)="bottomBarEmoji('🥂')">🥂</div>
                <div class="emojibox" none="İçki Olan Bardak" (click)="bottomBarEmoji('🥃')">🥃</div>
                <div class="emojibox" none="Pipetli Bardak" (click)="bottomBarEmoji('🥤')">🥤</div>
                <div class="emojibox" none="Yemek Çubukları" (click)="bottomBarEmoji('🥢')">🥢</div>
                <div class="emojibox" none="Çatal ve Bıçak" (click)="bottomBarEmoji('🍴')">🍴</div>
                <div class="emojibox" none="Kaşık" (click)="bottomBarEmoji('🥄')">🥄</div>
                <div class="emoji-kategori-box">🏇 ➤</div>
                <div class="emojibox" none="At Yarışı" (click)="bottomBarEmoji('🏇')">🏇</div>
                <div class="emojibox" none="Kayakçı" (click)="bottomBarEmoji('🏂')">🏂</div>
                <div class="emojibox" none="Kadın Tırmanma" (click)="bottomBarEmoji('🧗‍♀️')">🧗‍♀️</div>
                <div class="emojibox" none="Tırmanan Adam" (click)="bottomBarEmoji('🧗‍♂️')">🧗‍♂️</div>
                <div class="emojibox" none="Lotus Pozisyonunda Kadın" (click)="bottomBarEmoji('🧘‍♀️')">🧘‍♀️</div>
                <div class="emojibox" none="Lotus Pozisyonunda Erkek" (click)="bottomBarEmoji('🧘‍♂️')">🧘‍♂️</div>
                <div class="emojibox" none="Golf Oynayan Kişi" (click)="bottomBarEmoji('🏌')">🏌</div>
                <div class="emojibox" none="Erkek Golf" (click)="bottomBarEmoji('🏌️‍♂️')">🏌️‍♂️</div>
                <div class="emojibox" none="Kadın Golf" (click)="bottomBarEmoji('🏌️‍♀️')">🏌️‍♀️</div>
                <div class="emojibox" none="Sörf Yapan Kişi" (click)="bottomBarEmoji('🏄')">🏄</div>
                <div class="emojibox" none="Erkek Sörfçü" (click)="bottomBarEmoji('🏄‍♂️')">🏄‍♂️</div>
                <div class="emojibox" none="Kadın Sörfçü" (click)="bottomBarEmoji('🏄‍♀️')">🏄‍♀️</div>
                <div class="emojibox" none="Teknede Kürek Çeken Kişi" (click)="bottomBarEmoji('🚣')">🚣</div>
                <div class="emojibox" none="Adam Kürekli Tekne" (click)="bottomBarEmoji('🚣‍♂️')">🚣‍♂️</div>
                <div class="emojibox" none="Teknede Kürek Çeken Kadın" (click)="bottomBarEmoji('🚣‍♀️')">🚣‍♀️</div>
                <div class="emojibox" none="Yüzen Kişi" (click)="bottomBarEmoji('🏊')">🏊</div>
                <div class="emojibox" none="Yüzen Adam" (click)="bottomBarEmoji('🏊‍♂️')">🏊‍♂️</div>
                <div class="emojibox" none="Yüzen Kadın" (click)="bottomBarEmoji('🏊‍♀️')">🏊‍♀️</div>
                <div class="emojibox" none="Zıplayan Top" (click)="bottomBarEmoji('⛹')">⛹</div>
                <div class="emojibox" none="Adam Zıplayan Top" (click)="bottomBarEmoji('⛹️‍♂️')">⛹️‍♂️</div>
                <div class="emojibox" none="Kadın Zıplayan Top" (click)="bottomBarEmoji('⛹️‍♀️')">⛹️‍♀️</div>
                <div class="emojibox" none="Ağırlık Kaldıran Kişi" (click)="bottomBarEmoji('🏋')">🏋</div>
                <div class="emojibox" none="Ağırlık Kaldıran Adam" (click)="bottomBarEmoji('🏋️‍♂️')">🏋️‍♂️</div>
                <div class="emojibox" none="Ağırlık Kaldıran Kadın" (click)="bottomBarEmoji('🏋️‍♀️')">🏋️‍♀️</div>
                <div class="emojibox" none="Bisiklet Süren Kişi" (click)="bottomBarEmoji('🚴')">🚴</div>
                <div class="emojibox" none="Bisiklet Süren Erkek" (click)="bottomBarEmoji('🚴‍♂️')">🚴‍♂️</div>
                <div class="emojibox" none="Bisiklet Süren Kadın" (click)="bottomBarEmoji('🚴‍♀️')">🚴‍♀️</div>
                <div class="emojibox" none="Dağda Bisiklet Süren Kişi" (click)="bottomBarEmoji('🚵')">🚵</div>
                <div class="emojibox" none="Dağda Bisiklet Süren Adam" (click)="bottomBarEmoji('🚵‍♂️')">🚵‍♂️</div>
                <div class="emojibox" none="Dağda Bisiklet Süren Kadın" (click)="bottomBarEmoji('🚵‍♀️')">🚵‍♀️</div>
                <div class="emojibox" none="Amuda Kalkan Kişi" (click)="bottomBarEmoji('🤸')">🤸</div>
                <div class="emojibox" none="Amuda Kalkan Erkek" (click)="bottomBarEmoji('🤸‍♂️')">🤸‍♂️</div>
                <div class="emojibox" none="Amuda Kalkan Kadın" (click)="bottomBarEmoji('🤸‍♀️')">🤸‍♀️</div>
                <div class="emojibox" none="Güreşen İnsanlar" (click)="bottomBarEmoji('🤼')">🤼</div>
                <div class="emojibox" none="Erkekler Güreş" (click)="bottomBarEmoji('🤼‍♂️')">🤼‍♂️</div>
                <div class="emojibox" none="Kadınlar Güreş" (click)="bottomBarEmoji('🤼‍♀️')">🤼‍♀️</div>
                <div class="emojibox" none="Su Topu Oynayan Kişi" (click)="bottomBarEmoji('🤽')">🤽</div>
                <div class="emojibox" none="Su Topu Oynayan Erkek" (click)="bottomBarEmoji('🤽‍♂️')">🤽‍♂️</div>
                <div class="emojibox" none="Su Topu Oynayan Kadın" (click)="bottomBarEmoji('🤽‍♀️')">🤽‍♀️</div>
                <div class="emojibox" none="Hentbol Oynayan Kişi" (click)="bottomBarEmoji('🤾')">🤾</div>
                <div class="emojibox" none="Hentbol Oynayan Erkek" (click)="bottomBarEmoji('🤾‍♂️')">🤾‍♂️</div>
                <div class="emojibox" none="Hentbol Oynayan Kadın" (click)="bottomBarEmoji('🤾‍♀️')">🤾‍♀️</div>
                <div class="emojibox" none="Hokkabazlık Yapan Kişi" (click)="bottomBarEmoji('🤹')">🤹</div>
                <div class="emojibox" none="Erkek Hokkabazlık" (click)="bottomBarEmoji('🤹‍♂️')">🤹‍♂️</div>
                <div class="emojibox" none="Kadın Hokkabazlık" (click)="bottomBarEmoji('🤹‍♀️')">🤹‍♀️</div>
                <div class="emojibox" none="Sirk Çadırı" (click)="bottomBarEmoji('🎪')">🎪</div>
                <div class="emojibox" none="Bilet" (click)="bottomBarEmoji('🎫')">🎫</div>
                <div class="emojibox" none="Kupa" (click)="bottomBarEmoji('🏆')">🏆</div>
                <div class="emojibox" none="Spor Madalyası" (click)="bottomBarEmoji('🏅')">🏅</div>
                <div class="emojibox" none="1.lik Madalyası" (click)="bottomBarEmoji('🥇')">🥇</div>
                <div class="emojibox" none="2.lik Madalyası" (click)="bottomBarEmoji('🥈')">🥈</div>
                <div class="emojibox" none="3.lük Madalyası" (click)="bottomBarEmoji('🥉')">🥉</div>
                <div class="emojibox" none="Futbol Topu" (click)="bottomBarEmoji('⚽')">⚽</div>
                <div class="emojibox" none="Beyzbol Topu" (click)="bottomBarEmoji('⚾')">⚾</div>
                <div class="emojibox" none="Basketbol Topu" (click)="bottomBarEmoji('🏀')">🏀</div>
                <div class="emojibox" none="Voleybol Topu" (click)="bottomBarEmoji('🏐')">🏐</div>
                <div class="emojibox" none="Amerikan Futbolu Topu" (click)="bottomBarEmoji('🏈')">🏈</div>
                <div class="emojibox" none="Ragbi Futbolu Topu" (click)="bottomBarEmoji('🏉')">🏉</div>
                <div class="emojibox" none="Tenis Raketi" (click)="bottomBarEmoji('🎾')">🎾</div>
                <div class="emojibox" none="Bowling" (click)="bottomBarEmoji('🎳')">🎳</div>
                <div class="emojibox" none="Kriket Oyunu" (click)="bottomBarEmoji('🏏')">🏏</div>
                <div class="emojibox" none="Çim Jokeyi" (click)="bottomBarEmoji('🏑')">🏑</div>
                <div class="emojibox" none="Buz Hokeyi" (click)="bottomBarEmoji('🏒')">🏒</div>
                <div class="emojibox" none="Masa Tenisi" (click)="bottomBarEmoji('🏓')">🏓</div>
                <div class="emojibox" none="Badminton" (click)="bottomBarEmoji('🏸')">🏸</div>
                <div class="emojibox" none="Boks Eldiveni" (click)="bottomBarEmoji('🥊')">🥊</div>
                <div class="emojibox" none="Dövüş Sanatları Üniforması" (click)="bottomBarEmoji('🥋')">🥋</div>
                <div class="emojibox" none="Delik ile Bayrak" (click)="bottomBarEmoji('⛳')">⛳</div>
                <div class="emojibox" none="Buz Pateni" (click)="bottomBarEmoji('⛸')">⛸</div>
                <div class="emojibox" none="Olta Kamışı" (click)="bottomBarEmoji('🎣')">🎣</div>
                <div class="emojibox" none="Koşu Üstü" (click)="bottomBarEmoji('🎽')">🎽</div>
                <div class="emojibox" none="Kayaklar" (click)="bottomBarEmoji('🎿')">🎿</div>
                <div class="emojibox" none="Kızak" (click)="bottomBarEmoji('🛷')">🛷</div>
                <div class="emojibox" none="Curling Taşı" (click)="bottomBarEmoji('🥌')">🥌</div>
                <div class="emojibox" none="Dart" (click)="bottomBarEmoji('🎯')">🎯</div>
                <div class="emojibox" none="Bilardo Topu" (click)="bottomBarEmoji('🎱')">🎱</div>
                <div class="emojibox" none="Konsol" (click)="bottomBarEmoji('🎮')">🎮</div>
                <div class="emojibox" none="Kumar Makinesi" (click)="bottomBarEmoji('🎰')">🎰</div>
                <div class="emojibox" none="Zar" (click)="bottomBarEmoji('🎲')">🎲</div>
                <div class="emojibox" none="Tiyatro" (click)="bottomBarEmoji('🎭')">🎭</div>
                <div class="emojibox" none="Sanatçı Paleti" (click)="bottomBarEmoji('🎨')">🎨</div>
                <div class="emojibox" none="Müzik" (click)="bottomBarEmoji('🎼')">🎼</div>
                <div class="emojibox" none="Mikrofon" (click)="bottomBarEmoji('🎤')">🎤</div>
                <div class="emojibox" none="Kulaklık" (click)="bottomBarEmoji('🎧')">🎧</div>
                <div class="emojibox" none="Saksafon" (click)="bottomBarEmoji('🎷')">🎷</div>
                <div class="emojibox" none="Gitar" (click)="bottomBarEmoji('🎸')">🎸</div>
                <div class="emojibox" none="Müzikal Klavye" (click)="bottomBarEmoji('🎹')">🎹</div>
                <div class="emojibox" none="Trompet" (click)="bottomBarEmoji('🎺')">🎺</div>
                <div class="emojibox" none="Keman" (click)="bottomBarEmoji('🎻')">🎻</div>
                <div class="emojibox" none="Davul" (click)="bottomBarEmoji('🥁')">🥁</div>
                <div class="emojibox" none="Clepper" (click)="bottomBarEmoji('🎬')">🎬</div>
                <div class="emojibox" none="Yay ve Ok" (click)="bottomBarEmoji('🏹')">🏹</div>
                <div class="emoji-kategori-box">🗼 ➤</div>
                <div class="emojibox" none="Japonya Haritası" (click)="bottomBarEmoji('🗾')">🗾</div>
                <div class="emojibox" none="Volkan" (click)="bottomBarEmoji('🌋')">🌋</div>
                <div class="emojibox" none="Fuji Dağı" (click)="bottomBarEmoji('🗻')">🗻</div>
                <div class="emojibox" none="Ev" (click)="bottomBarEmoji('🏠')">🏠</div>
                <div class="emojibox" none="Bahçeli Ev" (click)="bottomBarEmoji('🏡')">🏡</div>
                <div class="emojibox" none="Ofis Binası" (click)="bottomBarEmoji('🏢')">🏢</div>
                <div class="emojibox" none="Japon Postanesi" (click)="bottomBarEmoji('🏣')">🏣</div>
                <div class="emojibox" none="Postane" (click)="bottomBarEmoji('🏤')">🏤</div>
                <div class="emojibox" none="Hastane" (click)="bottomBarEmoji('🏥')">🏥</div>
                <div class="emojibox" none="Banka" (click)="bottomBarEmoji('🏦')">🏦</div>
                <div class="emojibox" none="Otel" (click)="bottomBarEmoji('🏨')">🏨</div>
                <div class="emojibox" none="Aşk Oteli" (click)="bottomBarEmoji('🏩')">🏩</div>
                <div class="emojibox" none="Bakkal" (click)="bottomBarEmoji('🏪')">🏪</div>
                <div class="emojibox" none="Okul" (click)="bottomBarEmoji('🏫')">🏫</div>
                <div class="emojibox" none="Büyük Mağaza" (click)="bottomBarEmoji('🏬')">🏬</div>
                <div class="emojibox" none="Fabrika" (click)="bottomBarEmoji('🏭')">🏭</div>
                <div class="emojibox" none="Japon Kalesi" (click)="bottomBarEmoji('🏯')">🏯</div>
                <div class="emojibox" none="Kale" (click)="bottomBarEmoji('🏰')">🏰</div>
                <div class="emojibox" none="Düğün" (click)="bottomBarEmoji('💒')">💒</div>
                <div class="emojibox" none="Tokyo Kulesi" (click)="bottomBarEmoji('🗼')">🗼</div>
                <div class="emojibox" none="Özgürlük Anıtı" (click)="bottomBarEmoji('🗽')">🗽</div>
                <div class="emojibox" none="Kilise" (click)="bottomBarEmoji('⛪')">⛪</div>
                <div class="emojibox" none="Cami" (click)="bottomBarEmoji('🕌')">🕌</div>
                <div class="emojibox" none="Sinagog" (click)="bottomBarEmoji('🕍')">🕍</div>
                <div class="emojibox" none="Kabe" (click)="bottomBarEmoji('🕋')">🕋</div>
                <div class="emojibox" none="Çeşme" (click)="bottomBarEmoji('⛲')">⛲</div>
                <div class="emojibox" none="Çadır" (click)="bottomBarEmoji('⛺')">⛺</div>
                <div class="emojibox" none="Sisli" (click)="bottomBarEmoji('🌁')">🌁</div>
                <div class="emojibox" none="Yıldızlarla Gece" (click)="bottomBarEmoji('🌃')">🌃</div>
                <div class="emojibox" none="Dağların Üzerinde Gün Doğumu" (click)="bottomBarEmoji('🌄')">🌄</div>
                <div class="emojibox" none="Gündoğumu" (click)="bottomBarEmoji('🌅')">🌅</div>
                <div class="emojibox" none="Alacakaranlık Altındaki Şehir" (click)="bottomBarEmoji('🌆')">🌆</div>
                <div class="emojibox" none="Gün Batımı" (click)="bottomBarEmoji('🌇')">🌇</div>
                <div class="emojibox" none="Gece Köprü" (click)="bottomBarEmoji('🌉')">🌉</div>
                <div class="emojibox" none="Samanyolu" (click)="bottomBarEmoji('🌌')">🌌</div>
                <div class="emojibox" none="Atlıkarınca" (click)="bottomBarEmoji('🎠')">🎠</div>
                <div class="emojibox" none="Dönmedolap" (click)="bottomBarEmoji('🎡')">🎡</div>
                <div class="emojibox" none="Lunapark Hız Treni" (click)="bottomBarEmoji('🎢')">🎢</div>
                <div class="emojibox" none="Lokomotif" (click)="bottomBarEmoji('🚂')">🚂</div>
                <div class="emojibox" none="Vagon" (click)="bottomBarEmoji('🚃')">🚃</div>
                <div class="emojibox" none="Yüksek Hızlı Tren" (click)="bottomBarEmoji('🚄')">🚄</div>
                <div class="emojibox" none="Hızlı Tren" (click)="bottomBarEmoji('🚅')">🚅</div>
                <div class="emojibox" none="Tren" (click)="bottomBarEmoji('🚆')">🚆</div>
                <div class="emojibox" none="Metro" (click)="bottomBarEmoji('🚇')">🚇</div>
                <div class="emojibox" none="Hafif Raylı" (click)="bottomBarEmoji('🚈')">🚈</div>
                <div class="emojibox" none="İstasyon" (click)="bottomBarEmoji('🚉')">🚉</div>
                <div class="emojibox" none="Tramvay" (click)="bottomBarEmoji('🚊')">🚊</div>
                <div class="emojibox" none="Monorey" (click)="bottomBarEmoji('🚝')">🚝</div>
                <div class="emojibox" none="Dağ Demiryolu" (click)="bottomBarEmoji('🚞')">🚞</div>
                <div class="emojibox" none="Tramvay Arabası" (click)="bottomBarEmoji('🚋')">🚋</div>
                <div class="emojibox" none="Otobüs" (click)="bottomBarEmoji('🚌')">🚌</div>
                <div class="emojibox" none="Gelen Otobüs" (click)="bottomBarEmoji('🚍')">🚍</div>
                <div class="emojibox" none="Troleybüs" (click)="bottomBarEmoji('🚎')">🚎</div>
                <div class="emojibox" none="Minibüs" (click)="bottomBarEmoji('🚐')">🚐</div>
                <div class="emojibox" none="Ambulans" (click)="bottomBarEmoji('🚑')">🚑</div>
                <div class="emojibox" none="İtfaiye" (click)="bottomBarEmoji('🚒')">🚒</div>
                <div class="emojibox" none="Polis Arabası" (click)="bottomBarEmoji('🚓')">🚓</div>
                <div class="emojibox" none="Yaklaşan Polis Arabası" (click)="bottomBarEmoji('🚔')">🚔</div>
                <div class="emojibox" none="Taksi" (click)="bottomBarEmoji('🚕')">🚕</div>
                <div class="emojibox" none="Gelen Taksi" (click)="bottomBarEmoji('🚖')">🚖</div>
                <div class="emojibox" none="Otomobil" (click)="bottomBarEmoji('🚗')">🚗</div>
                <div class="emojibox" none="Yaklaşan Otomobil" (click)="bottomBarEmoji('🚘')">🚘</div>
                <div class="emojibox" none="Teslimat Kamyonu" (click)="bottomBarEmoji('🚚')">🚚</div>
                <div class="emojibox" none="Masfallı Kamyon" (click)="bottomBarEmoji('🚛')">🚛</div>
                <div class="emojibox" none="Traktör" (click)="bottomBarEmoji('🚜')">🚜</div>
                <div class="emojibox" none="Bisiklet" (click)="bottomBarEmoji('🚲')">🚲</div>
                <div class="emojibox" none="Scooter" (click)="bottomBarEmoji('🛴')">🛴</div>
                <div class="emojibox" none="Motorlu Scooter" (click)="bottomBarEmoji('🛵')">🛵</div>
                <div class="emojibox" none="Otobüs Durağı" (click)="bottomBarEmoji('🚏')">🚏</div>
                <div class="emojibox" none="Benzin Pompası" (click)="bottomBarEmoji('⛽')">⛽</div>
                <div class="emojibox" none="Polis Arabası Işığı" (click)="bottomBarEmoji('🚨')">🚨</div>
                <div class="emojibox" none="Tekne" (click)="bottomBarEmoji('⛵')">⛵</div>
                <div class="emojibox" none="Sürat Teknesi" (click)="bottomBarEmoji('🚤')">🚤</div>
                <div class="emojibox" none="Gemi" (click)="bottomBarEmoji('🚢')">🚢</div>
                <div class="emojibox" none="Uçak Kalkış" (click)="bottomBarEmoji('🛫')">🛫</div>
                <div class="emojibox" none="Uçak Varış" (click)="bottomBarEmoji('🛬')">🛬</div>
                <div class="emojibox" none="Oturma Yeri" (click)="bottomBarEmoji('💺')">💺</div>
                <div class="emojibox" none="Helikopter" (click)="bottomBarEmoji('🚁')">🚁</div>
                <div class="emojibox" none="Süspansiyon Demiryolu" (click)="bottomBarEmoji('🚟')">🚟</div>
                <div class="emojibox" none="Dağ Teleferiği" (click)="bottomBarEmoji('🚠')">🚠</div>
                <div class="emojibox" none="Hava Tramvayı" (click)="bottomBarEmoji('🚡')">🚡</div>
                <div class="emojibox" none="Roket" (click)="bottomBarEmoji('🚀')">🚀</div>
                <div class="emojibox" none="Uçan Daire" (click)="bottomBarEmoji('🛸')">🛸</div>
                <div class="emojibox" none="Havai Fişek" (click)="bottomBarEmoji('🎆')">🎆</div>
                <div class="emojibox" none="Maytap" (click)="bottomBarEmoji('🎇')">🎇</div>
                <div class="emojibox" none="Ay Görüntüleme Töreni" (click)="bottomBarEmoji('🎑')">🎑</div>
                <div class="emojibox" none="Moai Heykeli" (click)="bottomBarEmoji('🗿')">🗿</div>
                <div class="emojibox" none="Pasaport Kontrolü" (click)="bottomBarEmoji('🛂')">🛂</div>
                <div class="emojibox" none="Gümrük" (click)="bottomBarEmoji('🛃')">🛃</div>
                <div class="emojibox" none="Bagaj Teslim Yeri" (click)="bottomBarEmoji('🛄')">🛄</div>
                <div class="emojibox" none="Sol Bagaj" (click)="bottomBarEmoji('🛅')">🛅</div>
                <div class="emoji-kategori-box">💎 ➤</div>
                <div class="emojibox" none="Değerli Taş" (click)="bottomBarEmoji('💎')">💎</div>
                <div class="emojibox" none="Gözlük" (click)="bottomBarEmoji('👓')">👓</div>
                <div class="emojibox" none="Kravat" (click)="bottomBarEmoji('👔')">👔</div>
                <div class="emojibox" none="Tişört" (click)="bottomBarEmoji('👕')">👕</div>
                <div class="emojibox" none="Kot" (click)="bottomBarEmoji('👖')">👖</div>
                <div class="emojibox" none="Eşarp" (click)="bottomBarEmoji('🧣')">🧣</div>
                <div class="emojibox" none="Eldiven" (click)="bottomBarEmoji('🧤')">🧤</div>
                <div class="emojibox" none="Ceket" (click)="bottomBarEmoji('🧥')">🧥</div>
                <div class="emojibox" none="Çorap" (click)="bottomBarEmoji('🧦')">🧦</div>
                <div class="emojibox" none="Elbise" (click)="bottomBarEmoji('👗')">👗</div>
                <div class="emojibox" none="Kimono" (click)="bottomBarEmoji('👘')">👘</div>
                <div class="emojibox" none="Bikini" (click)="bottomBarEmoji('👙')">👙</div>
                <div class="emojibox" none="Kadın Giysisi" (click)="bottomBarEmoji('👚')">👚</div>
                <div class="emojibox" none="Çanta" (click)="bottomBarEmoji('👛')">👛</div>
                <div class="emojibox" none="El Çantası" (click)="bottomBarEmoji('👜')">👜</div>
                <div class="emojibox" none="Debriyaj Çantası" (click)="bottomBarEmoji('👝')">👝</div>
                <div class="emojibox" none="Okul Sırt Çantası" (click)="bottomBarEmoji('🎒')">🎒</div>
                <div class="emojibox" none="Kundura" (click)="bottomBarEmoji('👞')">👞</div>
                <div class="emojibox" none="Koşu Ayakkabısı" (click)="bottomBarEmoji('👟')">👟</div>
                <div class="emojibox" none="Topuklu Ayakkabı" (click)="bottomBarEmoji('👠')">👠</div>
                <div class="emojibox" none="Kadın Sandaleti" (click)="bottomBarEmoji('👡')">👡</div>
                <div class="emojibox" none="Kadın Botu" (click)="bottomBarEmoji('👢')">👢</div>
                <div class="emojibox" none="Taç" (click)="bottomBarEmoji('👑')">👑</div>
                <div class="emojibox" none="Kadın Şapkası" (click)="bottomBarEmoji('👒')">👒</div>
                <div class="emojibox" none="Sihirbaz Şapkası" (click)="bottomBarEmoji('🎩')">🎩</div>
                <div class="emojibox" none="Mezuniyet Kepi" (click)="bottomBarEmoji('🎓')">🎓</div>
                <div class="emojibox" none="Normal Şapka" (click)="bottomBarEmoji('🧢')">🧢</div>
                <div class="emojibox" none="Ruj" (click)="bottomBarEmoji('💄')">💄</div>
                <div class="emojibox" none="Yüzük" (click)="bottomBarEmoji('💍')">💍</div>
                <div class="emojibox" none="Kapalı Şemsiye" (click)="bottomBarEmoji('🌂')">🌂</div>
                <div class="emojibox" none="İş Çantası" (click)="bottomBarEmoji('💼')">💼</div>
                <div class="emojibox" none="Banyo Yapan Kişi" (click)="bottomBarEmoji('🛀')">🛀</div>
                <div class="emojibox" none="Yataktaki Kişi" (click)="bottomBarEmoji('🛌')">🛌</div>
                <div class="emojibox" none="Aşk Mektubu" (click)="bottomBarEmoji('💌')">💌</div>
                <div class="emojibox" none="Bomba" (click)="bottomBarEmoji('💣')">💣</div>
                <div class="emojibox" none="Yatay Trafik Lambası" (click)="bottomBarEmoji('🚥')">🚥</div>
                <div class="emojibox" none="Dik Trafik Lambası" (click)="bottomBarEmoji('🚦')">🚦</div>
                <div class="emojibox" none="İnşaat" (click)="bottomBarEmoji('🚧')">🚧</div>
                <div class="emojibox" none="Çapa" (click)="bottomBarEmoji('⚓')">⚓</div>
                <div class="emojibox" none="Tespih" (click)="bottomBarEmoji('📿')">📿</div>
                <div class="emojibox" none="Mutfak Bıçağı" (click)="bottomBarEmoji('🔪')">🔪</div>
                <div class="emojibox" none="Vazo" (click)="bottomBarEmoji('🏺')">🏺</div>
                <div class="emojibox" none="Berber Direği" (click)="bottomBarEmoji('💈')">💈</div>
                <div class="emojibox" none="Yağ Varili" (click)="bottomBarEmoji('🛢')">🛢</div>
                <div class="emojibox" none="Kum Saati Bitiş" (click)="bottomBarEmoji('⌛')">⌛</div>
                <div class="emojibox" none="Kum Saati Doldurma" (click)="bottomBarEmoji('⏳')">⏳</div>
                <div class="emojibox" none="Cep Saati" (click)="bottomBarEmoji('⌚')">⌚</div>
                <div class="emojibox" none="Alarm Saati" (click)="bottomBarEmoji('⏰')">⏰</div>
                <div class="emojibox" none="Kronometre" (click)="bottomBarEmoji('⏱')">⏱</div>
                <div class="emojibox" none="Zamanlayıcı Saat" (click)="bottomBarEmoji('⏲')">⏲</div>
                <div class="emojibox" none="Balon" (click)="bottomBarEmoji('🎈')">🎈</div>
                <div class="emojibox" none="Parti Bombası" (click)="bottomBarEmoji('🎉')">🎉</div>
                <div class="emojibox" none="Konfeti Topu" (click)="bottomBarEmoji('🎊')">🎊</div>
                <div class="emojibox" none="Japon Bebekler" (click)="bottomBarEmoji('🎎')">🎎</div>
                <div class="emojibox" none="Olta" (click)="bottomBarEmoji('🎏')">🎏</div>
                <div class="emojibox" none="Rüzgar Çanı" (click)="bottomBarEmoji('🎐')">🎐</div>
                <div class="emojibox" none="Kurdele" (click)="bottomBarEmoji('🎀')">🎀</div>
                <div class="emojibox" none="Hediye" (click)="bottomBarEmoji('🎁')">🎁</div>
                <div class="emojibox" none="Kristal Top" (click)="bottomBarEmoji('🔮')">🔮</div>
                <div class="emojibox" none="Radyo" (click)="bottomBarEmoji('📻')">📻</div>
                <div class="emojibox" none="Telefon" (click)="bottomBarEmoji('📱')">📱</div>
                <div class="emojibox" none="Ev Telefonu" (click)="bottomBarEmoji('☎')">☎</div>
                <div class="emojibox" none="Telefon" (click)="bottomBarEmoji('📞')">📞</div>
                <div class="emojibox" none="Pil" (click)="bottomBarEmoji('🔋')">🔋</div>
                <div class="emojibox" none="Kablo" (click)="bottomBarEmoji('🔌')">🔌</div>
                <div class="emojibox" none="Bilgisayar" (click)="bottomBarEmoji('💻')">💻</div>
                <div class="emojibox" none="Disket" (click)="bottomBarEmoji('💽')">💽</div>
                <div class="emojibox" none="CD" (click)="bottomBarEmoji('💿')">💿</div>
                <div class="emojibox" none="Film Kamerası" (click)="bottomBarEmoji('🎥')">🎥</div>
                <div class="emojibox" none="Televizyon" (click)="bottomBarEmoji('📺')">📺</div>
                <div class="emojibox" none="Kamera" (click)="bottomBarEmoji('📷')">📷</div>
                <div class="emojibox" none="Video Kamera" (click)="bottomBarEmoji('📹')">📹</div>
                <div class="emojibox" none="Büyüteç" (click)="bottomBarEmoji('🔎')">🔎</div>
                <div class="emojibox" none="Kitap" (click)="bottomBarEmoji('📗')">📗</div>
                <div class="emojibox" none="Kitap" (click)="bottomBarEmoji('📘')">📘</div>
                <div class="emojibox" none="Kitap" (click)="bottomBarEmoji('📙')">📙</div>
                <div class="emojibox" none="Kitap" (click)="bottomBarEmoji('📚')">📚</div>
                <div class="emojibox" none="Rapor" (click)="bottomBarEmoji('📃')">📃</div>
                <div class="emojibox" none="Dosya" (click)="bottomBarEmoji('📁')">📁</div>
                <div class="emojibox" none="Takvim" (click)="bottomBarEmoji('📅')">📅</div>
                <div class="emojibox" none="Takvim" (click)="bottomBarEmoji('📆')">📆</div>
                <div class="emojibox" none="Cetvel" (click)="bottomBarEmoji('📏')">📏</div>
                <div class="emojibox" none="Kilit" (click)="bottomBarEmoji('🔒')">🔒</div>
                <div class="emojibox" none="Çekiç" (click)="bottomBarEmoji('🔨')">🔨</div>
                <div class="emojibox" none="Silah" (click)="bottomBarEmoji('🔫')">🔫</div>
                <div class="emojibox" none="Kapı" (click)="bottomBarEmoji('🚪')">🚪</div>
                <div class="emojibox" none="Sigara" (click)="bottomBarEmoji('🚬')">🚬</div>
                <div class="emojibox" none="Oklu Kalp" (click)="bottomBarEmoji('💘')">💘</div>
                <div class="emojibox" none="Kırık Kalp" (click)="bottomBarEmoji('💔')">💔</div>
                <div class="emojibox" none="İkili Kalp" (click)="bottomBarEmoji('💕')">💕</div>
                <div class="emojibox" none="Parlayan Kalp" (click)="bottomBarEmoji('💖')">💖</div>
                <div class="emojibox" none="Büyüyen Kalp" (click)="bottomBarEmoji('💗')">💗</div>
                <div class="emojibox" none="Mavi Kalp" (click)="bottomBarEmoji('💙')">💙</div>
                <div class="emojibox" none="Yeşil Kalp" (click)="bottomBarEmoji('💚')">💚</div>
                <div class="emojibox" none="Sarı Kalp" (click)="bottomBarEmoji('💛')">💛</div>
                <div class="emojibox" none="Kurdeleli Kalp" (click)="bottomBarEmoji('💝')">💝</div>
                <div class="emojibox" none="Ter Damlacıkları" (click)="bottomBarEmoji('💦')">💦</div>
                <div class="emojibox" none="Ossuruk" (click)="bottomBarEmoji('💨')">💨</div>
                <div class="emoji-kategori-box">🖕 ➤</div>
                <div class="emojibox" none="Beğenme" (click)="bottomBarEmoji('👍')">👍</div>
                <div class="emojibox" none="Beğenmeme" (click)="bottomBarEmoji('👎')">👎</div>
                <div class="emojibox" none="Kaslı Kollar" (click)="bottomBarEmoji('💪')">💪</div>
                <div class="emojibox" none="Öz Çekim" (click)="bottomBarEmoji('🤳')">🤳</div>
                <div class="emojibox" none="Sağ İşaret Etme" (click)="bottomBarEmoji('👉')">👉</div>
                <div class="emojibox" none="Yukarı İşaret Etme" (click)="bottomBarEmoji('☝')">☝</div>
                <div class="emojibox" none="Orta Parmak İşareti" (click)="bottomBarEmoji('🖕')">🖕</div>
                <div class="emojibox" none="Aşağı İşaret Etme" (click)="bottomBarEmoji('👇')">👇</div>
                <div class="emojibox" none="Zafer Eli" (click)="bottomBarEmoji('✌')">✌</div>
                <div class="emojibox" none="Çapraz Parmaklar" (click)="bottomBarEmoji('🤞')">🤞</div>
                <div class="emojibox" none="Vulkan Selamı" (click)="bottomBarEmoji('🖖')">🖖</div>
                <div class="emojibox" none="Boynuz İşareti" (click)="bottomBarEmoji('🤘')">🤘</div>
                <div class="emojibox" none="Merhaba" (click)="bottomBarEmoji('🖐')">🖐</div>
                <div class="emojibox" none="Tamam" (click)="bottomBarEmoji('👌')">👌</div>
                <div class="emojibox" none="Yumruk" (click)="bottomBarEmoji('👊')">👊</div>
                <div class="emojibox" none="Sağ Yumruk" (click)="bottomBarEmoji('🤜')">🤜</div>
                <div class="emojibox" none="Sol Yumruk" (click)="bottomBarEmoji('🤛')">🤛</div>
                <div class="emojibox" none="El Arkası" (click)="bottomBarEmoji('🤚')">🤚</div>
                <div class="emojibox" none="El Sallamak" (click)="bottomBarEmoji('👋')">👋</div>
                <div class="emojibox" none="Yazı Yazmak" (click)="bottomBarEmoji('✍')">✍</div>
                <div class="emojibox" none="Alkışlamak" (click)="bottomBarEmoji('👏')">👏</div>
                <div class="emojibox" none="Katlanmış Eller" (click)="bottomBarEmoji('🙏')">🙏</div>
                <div class="emojibox" none="Kulak" (click)="bottomBarEmoji('👂')">👂</div>
                <div class="emojibox" none="Burun" (click)="bottomBarEmoji('👃')">👃</div>
                <div class="emojibox" none="Dil" (click)="bottomBarEmoji('👅')">👅</div>
                <div class="emojibox" none="Ağız" (click)="bottomBarEmoji('👄')">👄</div>
                <div class="emojibox" none="Dudak" (click)="bottomBarEmoji('💋')">💋</div>
            </div>
        </div>



        
            <div class="ust-sohbet-box">
                <div class="m-ust-sohbet-box bottom-bar-chat">
                <div class="sendlike"><svg height="18" width="22" viewBox="0 0 45.402 45.402"><path xmlns="http://www.w3.org/2000/svg" d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141   c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27   c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435   c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"></path></svg></div>
                    <input autocomplete="off" #chatInputView type="text" id="sohbet" placeholder="{{ 'widgets.chatinput.default' | translate }}" (input)="chatInputView.parentElement.dataset.value = chatInputView.value" [disabled]="floodBlocked" [maxLength]="inputMaxLength" />
                    <div class="populer-emoji">
                        <div class="pemoji-text">Popular Emoji</div>
                        <div class="pemoji-box" (click)="bottomBarEmoji('🤣')">🤣</div>
                        <div class="pemoji-box" (click)="bottomBarEmoji('⚡')">⚡</div>
                        <div class="pemoji-box" (click)="bottomBarEmoji('💪')">💪</div>
                        <div class="pemoji-box" (click)="bottomBarEmoji('👑')">👑</div>
                        <div class="pemoji-box" (click)="bottomBarEmoji('🖕')">🖕</div>
                    </div>
                </div>
                <nitro-room-chatinput-styleselector-component (styleSelected)="onStyleSelected($event)" style="z-index: 1;position: absolute;left: 0;top: 6px;">
                    <div class="bubble"><svg height="31px" width="31px" viewBox="0 0 38 38"><path d="M27.696201275253358,2.988001358825011 L3.305886312274442,2.988001358825011 C1.4825063507044054,2.988001358825011 0,4.327030833517681 0,5.972465269729918 L0,21.889738770729924 C0,23.53583642114458 1.4825063507044054,24.87420268163483 3.305886312274442,24.87420268163483 C5.619272089463823,24.87420268163483 5.930025402817621,24.87420268163483 5.930025402817621,24.87420268163483 L6.611772624548884,24.87420268163483 L6.611772624548884,29.848375521229915 C6.611772624548884,30.73575612407231 7.803360979773139,31.174140711874117 8.492454615531678,30.552045790001056 C11.56913281015509,27.773841496049794 9.408552444733061,29.725017679579178 14.458550911223227,25.16601693070109 C14.665719786792426,24.978990525617704 14.944883519828934,24.87420268163483 15.238005439517266,24.87420268163483 L27.696127811113094,24.87420268163483 C29.518773131280405,24.87420268163483 31.002014123387532,23.53583642114458 31.002014123387532,21.889738770729924 C31.002014123387532,12.600694330168755 31.002014123387532,15.284058993173478 31.002014123387532,5.972465269729918 C31.002087587527804,4.327030833517681 29.51884659542067,2.988001358825011 27.696201275253358,2.988001358825011 zM5.509883984597677,8.95692918063483 L21.084428650704478,8.95692918063483 C21.693446373565706,8.95692918063483 22.18639075479596,9.40194591046087 22.18639075479596,9.951750484269802 S21.693446373565706,10.94657178790477 21.084428650704478,10.94657178790477 L5.509883984597677,10.94657178790477 C4.900866261736452,10.94657178790477 4.407921880506195,10.501555058078722 4.407921880506195,9.951750484269802 S4.900866261736452,8.95692918063483 5.509883984597677,8.95692918063483 zM16.676506770198287,18.90527485982501 L5.509883984597677,18.90527485982501 C4.900866261736452,18.90527485982501 4.407921880506195,18.460258129998966 4.407921880506195,17.910453556190042 C4.407921880506195,17.360648982381115 4.900866261736452,16.915632252555074 5.509883984597677,16.915632252555074 L16.676506770198287,16.915632252555074 C17.285524493059512,16.915632252555074 17.778468874289768,17.360648982381115 17.778468874289768,17.910453556190042 C17.778468874289768,18.460258129998966 17.285524493059512,18.90527485982501 16.676506770198287,18.90527485982501 zM25.4922770670704,14.92592332386489 L5.509883984597677,14.92592332386489 C4.900866261736452,14.92592332386489 4.407921880506195,14.48090659403885 4.407921880506195,13.93110202022992 S4.900866261736452,12.936280716594949 5.509883984597677,12.936280716594949 L25.4922770670704,12.936280716594949 C26.10129478993163,12.936280716594949 26.59423917116188,13.381297446420998 26.59423917116188,13.93110202022992 S26.10129478993163,14.92592332386489 25.4922770670704,14.92592332386489 z" id="svg_3" stroke="null"></path></svg></div>
                </nitro-room-chatinput-styleselector-component>
                <div class="chatheadbox">
                    <div class="chb-filter">
                        <div class="altBar-emoji-kullan" (click)="emojiListAc()"></div>
                    </div>
                    <div class="chb-rightico"></div>
                </div>
            </div>
        
    </div>

    `

})
export class RoomChatInputComponent extends ConversionTrackingWidget implements OnInit, OnDestroy, AfterViewInit
{
    @ViewChild('chatInputView')
    public chatInputView: ElementRef<HTMLInputElement>;

    public selectedUsername: string                         = '';
    public floodBlocked: boolean                            = false;
    public floodBlockedSeconds: number                         = 0;
    public lastContent: string                              = '';
    public isTyping: boolean                                = false;
    public typingStartedSent: boolean                       = false;
    public typingTimer: ReturnType<typeof setTimeout>       = null;
    public idleTimer: ReturnType<typeof setTimeout>         = null;
    public floodTimer: ReturnType<typeof setTimeout>        = null;
    public floodInterval: ReturnType<typeof setInterval>    = null;
    public currentStyle: number                             = -1;
    public needsStyleUpdate: boolean                        = false;

    private _chatModeIdWhisper: string                      = null;
    private _chatModeIdShout: string                        = null;
    private _chatModeIdSpeak: string                        = null;
    private _maxChatLength: number                          = 0;
    public ela: boolean = false;
    
    constructor(
        private _ngZone: NgZone
    )
    {
        super();

        this.onKeyDownEvent                             = this.onKeyDownEvent.bind(this);
        this.onInputMouseDownEvent                      = this.onInputMouseDownEvent.bind(this);
        this.onInputChangeEvent                         = this.onInputChangeEvent.bind(this);
        this.onRoomWidgetRoomObjectUpdateEvent          = this.onRoomWidgetRoomObjectUpdateEvent.bind(this);
        this.onRoomWidgetUpdateInfostandUserEvent       = this.onRoomWidgetUpdateInfostandUserEvent.bind(this);
        this.onRoomWidgetChatInputContentUpdateEvent    = this.onRoomWidgetChatInputContentUpdateEvent.bind(this);
        this.onRoomWidgetFloodControlEvent              = this.onRoomWidgetFloodControlEvent.bind(this);
    }

    public emojiListAc()
    {
        if (this.ela == true)
        {
            this.ela = false;
        }
        else
        {
            this.ela = true;
        }
    }

    public bottomBarEmoji(emoji)
    {

        this.chatInputView.nativeElement.value += emoji;

    }

    public ngOnInit(): void
    {
        $(document).ready(function(){
            $(".sendlike").click(function(){
              $(".populer-emoji").toggleClass("popactive");
            });
          });
          
        this._chatModeIdWhisper = Nitro.instance.getLocalization('widgets.chatinput.mode.whisper');
        this._chatModeIdShout   = Nitro.instance.getLocalization('widgets.chatinput.mode.shout');
        this._chatModeIdSpeak   = Nitro.instance.getLocalization('widgets.chatinput.mode.speak');
        this._maxChatLength     = Nitro.instance.getConfiguration<number>('chat.input.maxlength', 100);
        this.currentStyle       = Nitro.instance.sessionDataManager.chatStyle;

    }

    
    public ngAfterViewInit(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            document.body.addEventListener('keydown', this.onKeyDownEvent);

            if(this.inputView)
            {
                this.inputView.addEventListener('mousedown', this.onInputMouseDownEvent);
                this.inputView.addEventListener('input', this.onInputChangeEvent);
            }
        });
    }

    public ngOnDestroy(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            document.body.removeEventListener('keydown', this.onKeyDownEvent);

            if(this.inputView)
            {
                this.inputView.removeEventListener('mousedown', this.onInputMouseDownEvent);
                this.inputView.removeEventListener('input', this.onInputChangeEvent);
            }
        });

        this.resetTypingTimer();
        this.resetIdleTimer();
        this.resetFloodInterval();
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this.onRoomWidgetRoomObjectUpdateEvent);
        eventDispatcher.addEventListener(RoomWidgetUpdateInfostandUserEvent.PEER, this.onRoomWidgetUpdateInfostandUserEvent);
        eventDispatcher.addEventListener(RoomWidgetChatInputContentUpdateEvent.RWWCIDE_CHAT_INPUT_CONTENT, this.onRoomWidgetChatInputContentUpdateEvent);
        eventDispatcher.addEventListener(RoomWidgetFloodControlEvent.RWFCE_FLOOD_CONTROL, this.onRoomWidgetFloodControlEvent);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this.onRoomWidgetRoomObjectUpdateEvent);
        eventDispatcher.removeEventListener(RoomWidgetUpdateInfostandUserEvent.PEER, this.onRoomWidgetUpdateInfostandUserEvent);
        eventDispatcher.removeEventListener(RoomWidgetChatInputContentUpdateEvent.RWWCIDE_CHAT_INPUT_CONTENT, this.onRoomWidgetChatInputContentUpdateEvent);
        eventDispatcher.removeEventListener(RoomWidgetFloodControlEvent.RWFCE_FLOOD_CONTROL, this.onRoomWidgetFloodControlEvent);
    }

    private onRoomWidgetRoomObjectUpdateEvent(event: RoomWidgetRoomObjectUpdateEvent): void
    {
        this.selectedUsername = '';
    }

    private onRoomWidgetUpdateInfostandUserEvent(event: RoomWidgetUpdateInfostandUserEvent): void
    {
        if(!event) return;

        this.selectedUsername = event.name;
    }

    private onRoomWidgetChatInputContentUpdateEvent(event: RoomWidgetChatInputContentUpdateEvent): void
    {
        if(!event) return;

        switch(event._Str_23621)
        {
            case RoomWidgetChatInputContentUpdateEvent.WHISPER: {
                const localization = Nitro.instance.getLocalization('widgets.chatinput.mode.whisper');

                this.changeInputValue(localization + ' ' + event.userName + ' ');
                return;
            }
            case RoomWidgetChatInputContentUpdateEvent.SHOUT:
                return;
        }
    }

    private onRoomWidgetFloodControlEvent(event: RoomWidgetFloodControlEvent): void
    {
        if(!event) return;

        this._ngZone.run(() =>
        {
            this.floodBlocked           = true;
            this.floodBlockedSeconds    = event.seconds;

            this.changeInputValue(Nitro.instance.getLocalizationWithParameter('chat.input.alert.flood', 'time', this.floodBlockedSeconds.toString()));

            this.startFloodInterval();
        });
    }

    private decreaseFloodBlockSeconds(): void
    {
        if(!this.floodBlockedSeconds)
        {
            this.resetFloodInterval();

            this.floodBlocked = false;

            this.changeInputValue('');

            return;
        }

        this.floodBlockedSeconds = (this.floodBlockedSeconds - 1);

        this.changeInputValue(Nitro.instance.getLocalizationWithParameter('chat.input.alert.flood', 'time', this.floodBlockedSeconds.toString()));
    }

    public sendChat(text: string, chatType: number, recipientName: string = '', styleId: number = 0): void
    {
        if(this.floodBlocked || !this.messageListener) return;

        this.changeInputValue('');

        this.messageListener.processWidgetMessage(new RoomWidgetChatMessage(RoomWidgetChatMessage.MESSAGE_CHAT, text, chatType, recipientName, styleId));
    }

    private changeInputValue(value: string): void
    {
        const inputView = ((this.chatInputView && this.chatInputView.nativeElement) || null);

        if(!inputView) return;

        inputView.parentElement.dataset.value = inputView.value = value;
    }

    private onKeyDownEvent(event: KeyboardEvent): void
    {
        if(!event) return;

        if(this.anotherInputHasFocus()) return;

        const input = this.chatInputView && this.chatInputView.nativeElement;

        if(document.activeElement !== input) this.setInputFocus();

        const key       = event.keyCode;
        const shiftKey  = event.shiftKey;

        switch(key)
        {
            case 32: // SPACE
                this.checkSpecialKeywordForInput();
                return;
            case 13: // ENTER
                this.sendChatFromInputField(shiftKey);
                return;
            case 8: // BACKSPACE
                if(this.inputView)
                {
                    const value = this.inputView.value;
                    const parts = value.split(' ');

                    if((parts[0] === this._chatModeIdWhisper) && (parts.length === 3) && (parts[2] === ''))
                    {
                        this.changeInputValue('');

                        this.lastContent        = '';
                    }
                }
                return;
            default:
                return;
        }
    }

    private onInputMouseDownEvent(event: MouseEvent): void
    {
        this.setInputFocus();
    }

    private onInputChangeEvent(event: InputEvent): void
    {
        const input = (event.target as HTMLInputElement);

        if(!input) return;

        const value = input.value;

        if(!value.length)
        {
            this.isTyping = false;

            this.startTypingTimer();
        }
        else
        {
            this.lastContent = value;

            if(!this.isTyping)
            {
                this.isTyping = true;

                this.startTypingTimer();
            }

            this.startIdleTimer();
        }
    }

    public onStyleSelected(styleId: number): void
    {
        if(styleId === this.currentStyle) return;

        this.currentStyle       = styleId;
        this.needsStyleUpdate   = true;
    }

    private sendChatFromInputField(shiftKey: boolean = false): void
    {
        if(!this.inputView || (this.inputView.value === '')) return;

        let chatType        = (shiftKey ? RoomWidgetChatMessage.CHAT_SHOUT : RoomWidgetChatMessage.CHAT_DEFAULT);
        let text            = this.inputView.value;

        const parts         = text.split(' ');

        let recipientName   = '';
        let append          = '';

        switch(parts[0])
        {
            case this._chatModeIdWhisper:
                chatType        = RoomWidgetChatMessage.CHAT_WHISPER;
                recipientName   = parts[1];
                append          = (this._chatModeIdWhisper + ' ' + recipientName + ' ');

                parts.shift();
                parts.shift();
                break;
            case this._chatModeIdShout:
                chatType = RoomWidgetChatMessage.CHAT_SHOUT;

                parts.shift();
                break;
            case this._chatModeIdSpeak:
                chatType = RoomWidgetChatMessage.CHAT_DEFAULT;

                parts.shift();
                break;
        }

        text = parts.join(' ');

        if(this.typingTimer) this.resetTypingTimer();

        if(this.idleTimer) this.resetIdleTimer();

        if(text.length <= this._maxChatLength)
        {
            if(this.needsStyleUpdate)
            {
                Nitro.instance.sessionDataManager.sendChatStyleUpdate(this.currentStyle);

                this.needsStyleUpdate = false;
            }

            this.sendChat(text, chatType, recipientName, this.currentStyle);
        }

        this.isTyping = false;

        if(this.typingStartedSent) this.sendTypingMessage();

        this.typingStartedSent = false;

        this.changeInputValue(append);

        this.lastContent = append;
    }

    private sendTypingMessage(): void
    {
        if(this.floodBlocked || !this.messageListener) return;

        this.messageListener.processWidgetMessage(new RoomWidgetChatTypingMessage(this.isTyping));
    }

    private anotherInputHasFocus(): boolean
    {
        const activeElement = document.activeElement;

        if(!activeElement) return false;

        if(this.chatInputView && this.chatInputView.nativeElement && (this.chatInputView.nativeElement === activeElement)) return false;

        if((!(activeElement instanceof HTMLInputElement) && !(activeElement instanceof HTMLTextAreaElement))) return false;

        return true;
    }

    private setInputFocus(): void
    {
        const input = this.chatInputView && this.chatInputView.nativeElement;

        if(!input) return;

        input.focus();

        input.setSelectionRange((input.value.length * 2), (input.value.length * 2));
    }

    private checkSpecialKeywordForInput(): void
    {
        const inputView = ((this.chatInputView && this.chatInputView.nativeElement) || null);

        if(!inputView || (inputView.value === '')) return;

        const text              = inputView.value;
        const selectedUsername  = this.selectedUsername;

        if((text !== this._chatModeIdWhisper) || (selectedUsername.length === 0)) return;

        this.changeInputValue(`${ inputView.value } ${ this.selectedUsername }`);
    }

    private startIdleTimer(): void
    {
        this.resetIdleTimer();

        this.idleTimer = setTimeout(this.onIdleTimerComplete.bind(this), 10000);
    }

    private resetIdleTimer(): void
    {
        if(this.idleTimer)
        {
            clearTimeout(this.idleTimer);

            this.idleTimer = null;
        }
    }

    private onIdleTimerComplete(): void
    {
        if(this.isTyping) this.typingStartedSent = false;

        this.isTyping = false;

        this.sendTypingMessage();
    }

    private startTypingTimer(): void
    {
        this.resetTypingTimer();

        this.typingTimer = setTimeout(this.onTypingTimerComplete.bind(this), 1000);
    }

    private resetTypingTimer(): void
    {
        if(this.typingTimer)
        {
            clearTimeout(this.typingTimer);

            this.typingTimer = null;
        }
    }

    private onTypingTimerComplete(): void
    {
        if(this.isTyping) this.typingStartedSent = true;

        this.sendTypingMessage();
    }

    private startFloodInterval(): void
    {
        this.resetFloodInterval();

        this.floodInterval = setInterval(this.decreaseFloodBlockSeconds.bind(this), 1000);
    }

    private resetFloodInterval(): void
    {
        if(this.floodInterval)
        {
            clearInterval(this.floodInterval);

            this.floodInterval = null;
        }
    }

    public get inputMaxLength(): number
    {
        return this._maxChatLength;
    }

    public get inputView(): HTMLInputElement
    {
        return ((this.chatInputView && this.chatInputView.nativeElement) || null);
    }

    public get handler(): ChatInputWidgetHandler
    {
        return (this.widgetHandler as ChatInputWidgetHandler);
    }

}
