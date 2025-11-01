import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
interface InstitutionCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  image?: string;
}
export const InstitutionCard = ({
  title,
  description,
  href,
  icon,
  image
}: InstitutionCardProps) => {
  return <Link to={href} className="block group">
      <Card className="p-8 md:p-10 h-full transition-all duration-200 hover:shadow-sm border border-border bg-gradient-to-b from-card to-muted/20 group-hover:border-primary/30">
        <div className="flex flex-col items-center text-center space-y-6">
          {image ? <div className="w-40 h-24 flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]">
              <img src={image} alt={title} className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
            </div> : icon ? <div className="p-6 rounded-full bg-muted text-primary transition-all duration-200 group-hover:bg-primary/10">
              {icon}
            </div> : null}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground transition-colors md:text-3xl">
              {title}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-md">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2 text-primary font-medium text-sm transition-all group-hover:gap-3 pt-2">
            <span>Öppna</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </Link>;
};