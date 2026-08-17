"use client";

import { useEffect, useState } from "react";
import { Play, Image as ImageIcon, Clapperboard, X } from "lucide-react";
import { getGallery } from "@/lib/api";
import type { GalleryItem } from "@/lib/types";
import { getYouTubeVideoId } from "@/lib/utils";

const TABS = [
  { key: "all", label: "All", icon: null },
  { key: "video", label: "Videos", icon: Play },
  { key: "short", label: "Shorts", icon: Clapperboard },
  { key: "image", label: "Images", icon: ImageIcon },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    setLoading(true);
    getGallery(activeTab === "all" ? undefined : activeTab)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const videos = items.filter((i) => i.category === "video" || i.category === "short");
  const images = items.filter((i) => i.category === "image");

  return (
    <div className="min-h-[60vh]">
      <div className="bg-ink-900 py-20 text-white">
        <div className="container-page">
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">Gallery</h1>
          <p className="mt-3 text-ink-300 text-lg">Videos, shorts, and images from my research journey.</p>
        </div>
      </div>

      <div className="border-b border-ink-100 bg-white">
        <div className="container-page">
          <div className="flex gap-1 overflow-x-auto py-3">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition whitespace-nowrap ${
                    active ? "bg-indigo-600 text-white" : "text-ink-600 hover:bg-ink-50"
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-page py-12">
        {loading ? (
          <div className="grid place-items-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-indigo-600" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-ink-500">No items found.</div>
        ) : (
          <>
            {(activeTab === "all" || activeTab === "video" || activeTab === "short") && videos.length > 0 && (
              <div className={activeTab === "all" ? "mb-12" : ""}>
                {activeTab === "all" && (
                  <h2 className="font-serif text-2xl font-bold text-ink-900 mb-6">Videos &amp; Shorts</h2>
                )}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {videos.map((item) => (
                    <VideoCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {(activeTab === "all" || activeTab === "image") && images.length > 0 && (
              <div>
                {activeTab === "all" && (
                  <h2 className="font-serif text-2xl font-bold text-ink-900 mb-6">Images</h2>
                )}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((item) => (
                    <ImageCard key={item.id} item={item} onClick={() => setLightbox(item)} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X size={24} />
          </button>
          <div className="max-h-[90vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {lightbox.file_url && (
              <img
                src={lightbox.file_url}
                alt={lightbox.title || lightbox.caption || ""}
                className="max-h-[80vh] w-auto rounded-lg"
              />
            )}
            {(lightbox.title || lightbox.caption) && (
              <p className="mt-4 text-center text-white text-lg">
                {lightbox.title}
                {lightbox.caption && lightbox.title ? ": " : ""}
                {lightbox.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function VideoCard({ item }: { item: GalleryItem }) {
  const ytId = item.youtube_url ? getYouTubeVideoId(item.youtube_url) : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-video bg-ink-100">
        {ytId ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : item.file_url ? (
          <video src={item.file_url} controls className="h-full w-full" />
        ) : item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt={item.title || ""} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-ink-400">No media</div>
        )}
      </div>
      {(item.title || item.caption) && (
        <div className="p-4">
          {item.title && <h3 className="font-semibold text-ink-900">{item.title}</h3>}
          {item.caption && <p className="mt-1 text-sm text-ink-500">{item.caption}</p>}
        </div>
      )}
    </div>
  );
}

function ImageCard({ item, onClick }: { item: GalleryItem; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl text-left"
    >
      <div className="aspect-[4/3] overflow-hidden bg-ink-100">
        {item.file_url && (
          <img
            src={item.file_url}
            alt={item.caption || item.title || ""}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </div>
      {(item.title || item.caption) && (
        <div className="p-4">
          {item.title && <h3 className="font-semibold text-ink-900">{item.title}</h3>}
          {item.caption && <p className="mt-1 text-sm text-ink-500 line-clamp-2">{item.caption}</p>}
        </div>
      )}
    </button>
  );
}
